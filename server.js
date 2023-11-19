const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
// const User = require('./models/user');

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
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  next();
});

//! dosyalardan veri çekme
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(err404Routes);

mongoose
  .connect(
    "mongodb+srv://selserhat01:56530474958s@cluster0.vyic7gs.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(3000);
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// mongoConnect(() => {
//   app.listen(port);
// });
