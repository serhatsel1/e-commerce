const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoConnect = require("./util/database").mongoConnect;


const app = express();

//! ejs

app.set("view engine", "ejs");
app.set("views", "views");
//! pug js için
// app.set("view engine","pug");
// app.set("views","views");

const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");
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
// app.use(shopRoutes);
app.use(err404Routes);

mongoConnect(() => {
  app.listen(port);
});
