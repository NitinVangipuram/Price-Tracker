
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const ora = require("ora");
const cors = require("cors");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const ProductData = {};


const API_Url ='http://localhost:3500/products';

app.post("/productData", async (req, res) => {
  const { productUrl, desiredPrice } = req.body;

  try {
    const data = await fetchPrice(productUrl, desiredPrice);

    if (data) {
     
      ProductData[productUrl] = data;
      ProductData[productUrl].desiredPrice = desiredPrice;
      ProductData[productUrl].productUrl = productUrl;

      
      res.status(200).json(data);
      
    } else {
      res.status(404).send("Product data not found.");
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).send("Error fetching product data.");
  }
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Use your email service's SMTP host
  port: 587, // Use the appropriate SMTP port
  secure: false, // Set to true if your SMTP service requires a secure connection
  auth: {
    user: "dharhacks@gmail.com",
    pass: "szklzuvvdoebwtjq",
  },
});

const sendEmail = async (to, subject, text, imagePath) => {
  const mailOptions = {
    from: "dharhacks@gmail.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const fetchPrice = async (productUrl, desiredPrice) => {
  const spinner = ora("Loading....").start();

  try {
    const response = await axios.get(productUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    let name = $("title").text().substr(0, 80);
    let gotThePrice = $(".a-price-whole").first().text();
    let image = $("#landingImage").attr("src");
    if (!gotThePrice) {
      spinner.fail("Price not found on the page.");
      return null;
    }

    const price = Number(gotThePrice.replace(/[^\d.]/g, ""));
    spinner.succeed(`Fetched price for ${name}: ${price}`);

    // Check if the price is below or equals the desired price
    if (price <= desiredPrice) {
      const emailText = `${name} is now available for ${price}. Desired price: ${desiredPrice}`;
      await sendEmail("dharhacks@gmail.com", "Price Alert", emailText);
    }

    return { name, price,image };
  } catch (error) {
    spinner.fail("Error fetching product price.");
    console.error("Error fetching product price:", error);
    return null;
  }
};

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



cron.schedule("*/5 * * * *", async () => {
    try {
      // Read the JSON data from db.json
      const fs = require("fs");
      const dbData = JSON.parse(fs.readFileSync("./db.json", "utf8"));
      console.log(dbData);
      console.log("Checking prices...");
  
      // Loop through the products in dbData and check for updated prices
      for (let i = 0; i < dbData.products.length; i++) {
        const { name, price, image, desiredPrice, productUrl, id } = dbData.products[i];
  
        try {
          const response = await axios.get(productUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
            },
          });
  
          const $ = cheerio.load(response.data);
          let gotThePrice = $(".a-price-whole").first().text();
  
          if (!gotThePrice) {
            console.log(`Price not found on ${name}`);
            continue; // Skip this product if price not found
          }
          // Number(gotThePrice.replace(/[^\d.]/g, ""))
          const newPrice =100 ;  // Replace with your logic to get the new price
          console.log(`Fetched updated price for ${name}: ${newPrice}`);
  
          if (newPrice < dbData.products[i].price) {
            // Update the price in the dbData object
            dbData.products[i].price = newPrice;
  
            // Write the updated dbData back to db.json
            fs.writeFileSync("./db.json", JSON.stringify(dbData, null, 2));
  
            const emailText = `${name} is now available for ${newPrice}. Desired price: ${desiredPrice} before it was around ${dbData.products[i].price} `;
            await sendEmail("dharhacks@gmail.com", "Price Alert", emailText);
          }
        } catch (error) {
          console.error(`Error fetching product price for ${name}:`, error);
        }
      }
    } catch (error) {
      console.error("Error reading db.json:", error);
    }
  });
  