const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const db = require("./util/database");

//! ejs

app.set("view engine", "ejs");
app.set("views", "views");
//! pug js için
// app.set("view engine","pug");
// app.set("views","views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const err404Routes = require("./routes/err404");

db.execute("SELECT * FROM  products")
  .then((result) => {
    console.log("database result :",result[0],result[1]);
  })
  .catch((err) => {
    console.log("err:",err);
  });

const hostName = "127.0.0.1";
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

//! static olan css dosyaları için
app.use(express.static(path.join(__dirname, "public")));
//! dosyalardan veri çekme
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(err404Routes);

app.listen(port);

console.log(`Server başlatıldı --> http://${hostName}:${port}`);
