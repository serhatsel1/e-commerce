const path = require("path");

const express = require("express");
//! dosya yolunu mainden çektik

const productsController = require("../controllers/products")


const router = express.Router();

//! admin/add-product => GET
router.get("/add-product",productsController.getAddProduct);
//! admin/add-product => POST
router.post("/add-product",productsController.postAddProducts);

module.exports = router;
// exports.routes = router;
// exports.products = products;
