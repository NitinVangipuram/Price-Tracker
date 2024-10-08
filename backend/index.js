var express = require("express");
var app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
const ora = require("ora");
var bodyParser = require('body-parser');
var path = require('path');
require('dotenv').config();
var mongoose = require("mongoose");
mongoose.connect('mongodb+srv://dharhacks:KfYYaWCNDC7ZCqaF@cluster0.kwhiyso.mongodb.net/trackerDB');
var product = require("./model/product.js");
var user = require("./model/user.js");
app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({     
  extended: false
}));

app.use("/", async (req, res, next) => {
  try {
    const openPaths = ["/login", "/register", "/", "/google-login"];
    if (openPaths.includes(req.path)) {
      return next();
    }
    // Check for token in headers
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        errorMessage: 'Token not provided!',
        status: false
      });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, 'shhhhh11111');
      if (decoded && decoded.user) {
        req.user = decoded; 
        return next();
      } else {
        return res.status(401).json({
          errorMessage: 'User unauthorized!',
          status: false
        });
      }
    } catch (err) {
      return res.status(401).json({
        errorMessage: 'Invalid token!',
        status: false
      });
    }

  } catch (e) {
    // General error handler for unexpected errors
    return res.status(500).json({
      errorMessage: 'Internal server error!',
      status: false
    });
  }
});


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

          if (bcrypt.compare(data[0].password, req.body.password)) {
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

const saltRounds = 10; 

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      errorMessage: 'Add proper parameter first!',
      status: false
    });
  }

  user.findOne({ username }, (err, existingUser) => {
    if (err) {
      return res.status(500).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }

    if (existingUser) {
      return res.status(400).json({
        errorMessage: `UserName ${username} Already Exists!`,
        status: false
      });
    }

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({
          errorMessage: 'Error hashing password!',
          status: false
        });
      }

      const newUser = new user({
        username,
        password: hashedPassword
      });

      newUser.save((err) => {
        if (err) {
          return res.status(400).json({
            errorMessage: 'Error saving user!',
            status: false
          });
        }

        res.status(200).json({
          status: true,
          title: 'Registered Successfully.'
        });
      });
    });
  });
});

app.post("/google-login", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body && req.body.username && req.body.verified) {
      const existingUser = await user.findOne({ username: req.body.username });

      if (existingUser) {
        // User exists, generate token if verified is true
        if (req.body.verified) {
          checkUserAndGenerateToken(existingUser, req, res);
        } else {
          res.status(400).json({
            errorMessage: 'User is not verified!',
            status: false
          });
        }
      } else {
        // User doesn't exist, create a new user if verified is true
        if (req.body.verified) {
          const newUser = new user({
            username: req.body.username,
            verified: req.body.verified
          });

          try {
            const savedUser = await newUser.save();
            checkUserAndGenerateToken(savedUser, req, res);
          } catch (err) {
            res.status(500).json({
              errorMessage: 'Error creating a new user!',
              status: false
            });
          }
        } else {
          res.status(400).json({
            errorMessage: 'User not found and not verified!',
            status: false
          });
        }
      }
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameters first!',
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
app.post("/add-product",async(req, res) => {
 
   
    if ( req.body.name &&req.body.price ) {
       console.log(req.body);
     
       try {
     
       const data = await fetchPrice(req.body.name, req.body.price,req.user.id);
       console.log(data);
      let new_product = new product();
      new_product.productUrl=req.body.name;
      new_product.name = data.name;
      new_product.price = data.price;
      new_product.image = data.image;
      new_product.user_id = req.user.id;
      new_product.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Product Added successfully.'
          });
        }
      });}
      catch (error) {
        console.error("Error fetching product data:", error);
        res.status(500).send("Error fetching product data.");
      }

      
    }
     else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }

});

/* Api to delete Product */
app.post("/delete-product", (req, res) => {
  try {
    if (req.body && req.body.id) {
      product.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
        if (data.is_delete) {
          res.status(200).json({
            status: true,
            title: 'Product deleted.'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
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
app.get("/get-product", (req, res) => {
  try {
    var query = {
      is_delete: false,
      user_id: req.user.id
    };
    // Removed pagination logic
    product.find(query)
      .then((data) => {
        if (data && data.length > 0) {
          res.status(200).json({
            status: true,
            title: 'Product retrieved.',
            products: data,
          });
        } else {
          res.status(400).json({
            errorMessage: 'There is no product!',
            status: false
          });
        }
      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});



const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 587, 
  secure: false, 
  auth: {
    user: "dharhacks@gmail.com",
    pass: process.env.APP_PASSWORD,
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


const fetchPrice = async (productUrl, desiredPrice, user_id) => {
  const spinner = ora("Loading....").start();

  try {
    // Fetch the product page
    const response = await axios.get(productUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // Extract product details
    let name = $("title").text().substr(0, 80);
    let gotThePrice = $(".a-price-whole").first().text();
    let image = $("#landingImage").attr("src");

    // If the price is not found, log an error and return null
    if (!gotThePrice) {
      spinner.fail("Price not found on the page.");
      return null;
    }

    // Extract and format the price
    const price = Number(gotThePrice.replace(/[^\d.]/g, ""));
    spinner.succeed(`Fetched price for ${name}: ${price}`);

    // If the price is below the desiredPrice, send an email notification
    if (price <= desiredPrice) {
      const data = await user.findOne({ _id: user_id });

      if (data) {
        const emailText = `${name} is now available for ${price}. Desired price: ${desiredPrice} . Check here ${productUrl}`;
        await sendEmail(data.username, "Price Alert", emailText);
      }
    }

    return { name, price, image };
  } catch (error) {
    spinner.fail("Error fetching product price.");
    console.error("Error fetching product price:", error);
    return null;
  }
};



app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});


cron.schedule("*/30 * * * *", async () => {
    try {
      const products = await product.find({ is_delete: false });
      // console.log(products);
      console.log("Checking prices...");
  
      // Loop through the products in dbData and check for updated prices
      for (let i = 0; i <products.length; i++) {
        const { name, price, image, desiredPrice, productUrl, _id ,user_id} = products[i];
        console.log(_id);
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
          const newPrice =Number(gotThePrice.replace(/[^\d.]/g, ""));  
          console.log(`Fetched updated price for ${name}: ${newPrice}`);
  
          if (newPrice < products[i].price) {
            const user_id = products[i].user_id;
            const prev = products[i].price;
   
                    product.updateOne({ _id: _id }, { price: newPrice }).maxTimeMS(30000)
                    .then(result => {
                      console.log(result);
                    })
                    .catch(err => {
                      console.log(err);
                    });

                user.find({ _id: user_id }).maxTimeMS(30000).exec(async (err, data) => {
                  if (err) {
                    console.error("Error finding user:", err);
                  } else {
                    if (Array.isArray(data) && data.length > 0) {
                      const emailText = `${name} is now available for ${newPrice}. before it was around ${prev}. Check out here ${productUrl}`;
                      await sendEmail(data[0].username, "Price Alert", emailText);
                    }
                  }
                });
                
            
           
           
          }
        } catch (error) {
          console.error(`Error fetching product price for ${name}:`, error);
        }
      }
    } catch (error) {
      console.error("Error reading db.json:", error);
    }
  });
  
app.use(cors(
  {
    origin:[''],
    methods:['GET','POST'],
    credentials: true // enable set cookie
  }
));