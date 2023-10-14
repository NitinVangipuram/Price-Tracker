
// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const ora = require("ora");
// const cors = require("cors");
// const cron = require("node-cron");
// const nodemailer = require("nodemailer");
// const bcrypt = require('bcrypt');
// var jwt = require('jsonwebtoken');
// path = require('path');
// var mongoose = require("mongoose");
// mongoose.connect('mongodb://127.0.0.1/productDB');
// var product = require("./model/product.js");
// var user = require("./model/user.js");
// app.use(cors());
// app.use(bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: false
// }));
var express = require("express");
var app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
  bodyParser = require('body-parser'),
  path = require('path');
var mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1/productDB');
var fs = require('fs');
var user = require("./model/user.js");
var product = require("./model/product.js");
app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});

/* login api */
app.post("/login", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {

          if (bcrypt.compareSync(data[0].password, req.body.password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {

            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }

        } else {
          res.status(400).json({
            errorMessage: 'Username or password is incorrect!',
            status: false
          });
        }
      })
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* register api */
app.post("/register", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {

      user.find({ username: req.body.username }, (err, data) => {

        if (data.length == 0) {

          let User = new user({
            username: req.body.username,
            password: req.body.password
          });
          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'Registered Successfully.'
              });
            }
          });

        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false
          });
        }

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        token: token,
        status: true
      });
    }
  });
}



// app.post("/productData", async (req, res) => {
//   const { productUrl, desiredPrice } = req.body;

//   try {
//     const data = await fetchPrice(productUrl, desiredPrice);

//     if (data) {
     
//       ProductData[productUrl] = data;
//       ProductData[productUrl].desiredPrice = desiredPrice;
//       ProductData[productUrl].productUrl = productUrl;

      
//       res.status(200).json(data);
      
//     } else {
//       res.status(404).send("Product data not found.");
//     }
//   } catch (error) {
//     console.error("Error fetching product data:", error);
//     res.status(500).send("Error fetching product data.");
//   }
// });

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

const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// cron.schedule("*/5 * * * *", async () => {
//     try {
//       // Read the JSON data from db.json
//       const fs = require("fs");
//       const dbData = JSON.parse(fs.readFileSync("./db.json", "utf8"));
//       console.log(dbData);
//       console.log("Checking prices...");
  
//       // Loop through the products in dbData and check for updated prices
//       for (let i = 0; i < dbData.products.length; i++) {
//         const { name, price, image, desiredPrice, productUrl, id } = dbData.products[i];
  
//         try {
//           const response = await axios.get(productUrl, {
//             headers: {
//               "User-Agent":
//                 "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
//             },
//           });
  
//           const $ = cheerio.load(response.data);
//           let gotThePrice = $(".a-price-whole").first().text();
  
//           if (!gotThePrice) {
//             console.log(`Price not found on ${name}`);
//             continue; // Skip this product if price not found
//           }
//           // Number(gotThePrice.replace(/[^\d.]/g, ""))
//           const newPrice =100 ;  // Replace with your logic to get the new price
//           console.log(`Fetched updated price for ${name}: ${newPrice}`);
  
//           if (newPrice < dbData.products[i].price) {
//             // Update the price in the dbData object
//             dbData.products[i].price = newPrice;
  
//             // Write the updated dbData back to db.json
//             fs.writeFileSync("./db.json", JSON.stringify(dbData, null, 2));
  
//             const emailText = `${name} is now available for ${newPrice}. Desired price: ${desiredPrice} before it was around ${dbData.products[i].price} `;
//             await sendEmail("dharhacks@gmail.com", "Price Alert", emailText);
//           }
//         } catch (error) {
//           console.error(`Error fetching product price for ${name}:`, error);
//         }
//       }
//     } catch (error) {
//       console.error("Error reading db.json:", error);
//     }
//   });
  