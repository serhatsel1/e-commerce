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
const err404Routes = require("./routes/err404");
// const Cart = require("./model/cart");

const hostName = "127.0.0.1";
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

//! static olan css dosyaları için
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("655a60adf536f70dc27508f6")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//! dosyalardan veri çekme
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(err404Routes);

mongoose
  .connect(process.env.DB_ACCESS)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Serhat",
          email: process.env.MAIL,
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
