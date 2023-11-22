const path = require("path");
const dotenv = require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./model/user");

const app = express();

//! ejs

app.set("view engine", "ejs");
app.set("views", "views");
//! pug js için
// app.set("view engine","pug");
// app.set("views","views");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const err404Routes = require("./routes/err404");
// const Cart = require("./model/cart");

const hostName = "127.0.0.1";
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));

//! static olan css dosyaları için

app.use(express.static("public"));  

app.use(async (req, res, next) => {
  await User.findById("655e19584de42ed015c18121")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//! dosyalardan veri çekme
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(err404Routes);

mongoose
  .connect(process.env.DB_ACCESS)
  .then(async (result) => {
    try {
      const user = await User.findOne();
      if (!user) {
        const newUser = new User({
          name: "Serhat",
          email: "selserhat01@gmail.com",
          cart: {
            items: [],
          },
        });
        await newUser.save();
      }

      app.listen(3000);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.log(error);
    }
  })
  .catch((err) => {
    console.log(err);
  });
