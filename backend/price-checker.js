require('dotenv').config();
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");

// Import your models
const product = require("./model/product.js");
const user = require("./model/user.js");

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dharhacks:KfYYaWCNDC7ZCqaF@cluster0.kwhiyso.mongodb.net/trackerDB';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "dharhacks@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

// Send email function
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || "dharhacks@gmail.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

// Main price checking function
const checkPrices = async () => {
  try {
    const products = await product.find({ is_delete: false });
    console.log(`\n🔍 Checking prices for ${products.length} products...\n`);

    if (products.length === 0) {
      console.log("No products to check. Exiting.");
      await mongoose.connection.close();
      process.exit(0);
    }

    let checkedCount = 0;
    let updatedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const { name, price, productUrl, _id, user_id } = products[i];
      
      console.log(`[${i + 1}/${products.length}] Checking: ${name.substring(0, 50)}...`);
      
      try {
        const response = await axios.get(productUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          timeout: 10000, // 10 second timeout
        });

        const $ = cheerio.load(response.data);
        let gotThePrice = $(".a-price-whole").first().text();

        if (!gotThePrice) {
          console.log(`⚠️  Price not found for this product`);
          continue;
        }

        const newPrice = Number(gotThePrice.replace(/[^\d.]/g, ""));
        checkedCount++;
        
        console.log(`   Current: ₹${price} | New: ₹${newPrice}`);

        // Check if price dropped
        if (newPrice < price) {
          console.log(`   🎉 Price dropped! Updating database and sending email...`);
          updatedCount++;
          
          // Update price in database
          await product.updateOne({ _id: _id }, { price: newPrice });

          // Send email notification
          const userData = await user.findById(user_id);
          if (userData) {
            const emailText = `Great news! The price of "${name}" has dropped!\n\nPrevious Price: ₹${price}\nNew Price: ₹${newPrice}\nYou save: ₹${(price - newPrice).toFixed(2)}\n\nCheck it out here: ${productUrl}\n\nHappy Shopping! 🛒`;
            await sendEmail(userData.username, "🎉 Price Drop Alert!", emailText);
          }
        } else {
          console.log(`   ✓ No price change`);
        }

        // Add delay to avoid rate limiting (2 seconds between requests)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`   ❌ Error checking this product: ${error.message}`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total products: ${products.length}`);
    console.log(`   Successfully checked: ${checkedCount}`);
    console.log(`   Price drops found: ${updatedCount}`);
    console.log(`\n✅ Price check completed!\n`);
    
    // Close MongoDB connection and exit
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Fatal error in price checker:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the price checker
console.log("🚀 Starting price checker...");
checkPrices();