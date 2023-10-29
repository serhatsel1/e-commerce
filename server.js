const express = require("express");
const bodyParser = require("body-parser");
const path = require("path")
const app = express();
const expressHbs =  require("express-handlebars")

//! express-handlebars için
app.engine("hbs",expressHbs({layoutsDir: "views/layouts/", defaultLayout:"main-layout"}))
app.set("view engine","hbs");
app.set("views","views");
//! pug js için
app.set('views', path.join(__dirname, 'views'));
// app.set("view engine","pug");
// app.set("views","views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const err404Routes = require("./routes/err404");

const hostName = "127.0.0.1";
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));

//! static olan css dosyaları için
app.use(express.static(path.join(__dirname,"public")));
//! dosyalardan veri çekme
app.use("/admin",adminData.routes);
app.use(shopRoutes);
app.use(err404Routes);


app.listen(port);

console.log(`Server başlatıldı --> http://${hostName}:${port}`);
