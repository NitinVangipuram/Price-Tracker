var express = require("express");
var app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
const ora = require("ora");
var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');
var mongoose = require("mongoose");
mongoose.connect('mongodb+srv://dharhacks:KfYYaWCNDC7ZCqaF@cluster0.kwhiyso.mongodb.net/trackerDB');
var fs = require('fs');
var product = require("./model/product.js");
var user = require("./model/user.js");
// var dir = './uploads';
// var upload = multer({
//   storage: multer.diskStorage({

//     destination: function (req, file, callback) {
//       if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir);
//       }
//       callback(null, './uploads');
//     },
//     filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

//   }),

//   fileFilter: function (req, file, callback) {
//     var ext = path.extname(file.originalname)
//     if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
//       return callback(/*res.end('Only images are allowed')*/ null, false)
//     }
//     callback(null, true)
//   }
// });
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
  //  catch (e) {
  //   res.status(400).json({
  //     errorMessage: 'Something went wrong!',
  //     status: false
  //   });
  // }
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
app.post("/update-product", (req, res) => {
  try {
    if (req.files && req.body && req.body.name && req.body.desc && req.body.price &&
      req.body.id && req.body.discount) {

      product.findById(req.body.id, (err, new_product) => {

        // if file already exist than remove it
        if (req.files && req.files[0] && req.files[0].filename && new_product.image) {
          var path = `./uploads/${new_product.image}`;
          fs.unlinkSync(path);
        }

        if (req.files && req.files[0] && req.files[0].filename) {
          new_product.image = req.files[0].filename;
        }
        if (req.body.name) {
          new_product.name = req.body.name;
        }
        if (req.body.desc) {
          new_product.desc = req.body.desc;
        }
        if (req.body.price) {
          new_product.price = req.body.price;
        }
        if (req.body.discount) {
          new_product.discount = req.body.discount;
        }

        new_product.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'Product updated.'
            });
          }
        });

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
/*Api to get and search product with pagination and search by name*/
app.get("/get-product", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        name: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    product.find(query, { date: 1, name: 1, id: 1, desc: 1, price: 1, discount: 1, image: 1 })
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        product.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'Product retrived.',
                products: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no product!',
                status: false
              });
            }

          });

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

// const fetchPrice = async (productUrl, desiredPrice,user_id) => {
//   const spinner = ora("Loading....").start();
//   try {
//     const response = await axios.get(productUrl, {
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
//       },
//     });

//     const $ = cheerio.load(response.data);

//     let name = $("title").text().substr(0, 80);
//     let gotThePrice = $(".a-price-whole").first().text();
//     let image = $("#landingImage").attr("src");
//     if (!gotThePrice) {
//       spinner.fail("Price not found on the page.");
//       return null;
//     }

//     const price = Number(gotThePrice.replace(/[^\d.]/g, ""));
//     spinner.succeed(`Fetched price for ${name}: ${price}`);
//     if (price <= desiredPrice) {
//       const emailText = `${name} is now available for ${price}. Desired price: ${desiredPrice}`;
//       user.find({ _id: user_id }, async(err, data) => {
//         console.log(data)
//         if (data.length > 0) {
//           await  sendEmail(data[0].username, "Price Alert", emailText);
//         }
        
//       })
//     //  sendEmail("dharhacks@gmail.com", "Price Alert", emailText);
//     }

//     return { name, price,image };
//   } catch (error) {
//     spinner.fail("Error fetching product price.");
//     console.error("Error fetching product price:", error);
//     return null;
//   }
// };
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
        const emailText = `${name} is now available for ${price}. Desired price: ${desiredPrice}`;
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

// Example usage
// fetchPrice("https://example.com/product-page", 50, "user_id")

app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});


cron.schedule("*/1 * * * *", async () => {
    try {
      const products = await product.find({ is_delete: false });
      console.log(products);
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
          const newPrice =10;  // Replace with your logic to get the new price
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
                      const emailText = `${name} is now available for ${newPrice}. Desired price: ${desiredPrice} before it was around ${prev}`;
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
  