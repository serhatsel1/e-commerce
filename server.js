const path = require("path");
const dotenv = require("dotenv").config();


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

const errorController = require("./controllers/error");
const User = require("./model/user");

const app = express();
const strore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

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

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: strore,
  })
);
app.use(flash());
app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    } else {
      const user = await User.findById(req.session.user._id);

      req.user = user;
      next();
    }
  } catch (error) {
    console.log("request user -->", error);
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  console.log("res.locals.isAuthenticated-->", res.locals.isAuthenticated);
  next();
});


app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(err404Routes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async (result) => {
    try {
      app.listen(3000);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.log(error);
    }
  })
  .catch((err) => {
    console.log(err);
  });
