const path = require("path");
const express = require("express");
const rootDir = require("../util/path");
const adminData = require("./admin");
const router = express.Router();

router.get("/", (req, res, next) => {
  // console.log("selamm");
  // res.send("<h1>Hello From express !!</h1>");
  //!Html sayfasını yönledirmee
  // console.log("shop.js",adminData.product);
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  //! buradada pug dosyasını yönlendiriyoruz
  const products = adminData.products;
  res.render("shop",{prods : products , docTitle:"Shop", path:"/"});
});

module.exports = router;

