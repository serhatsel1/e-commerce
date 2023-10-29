const path = require("path");

const express = require("express");
//! dosya yolunu mainden çektik

const rootDir = require("../util/path");

const router = express.Router();
const products = [];
//! admin/add-product => GET
router.get("/add-product", (req, res, next) => {
  // console.log("add-product");
  //! Html Sayfası içim
  // res.sendFile(path.join(rootDir,"views","add-product.html"))
  //! Pug sayfası için
  res.render("add-product", { pageTitle: "Add Product", path:"/admin/add-product"});
});
//! admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  this.products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
