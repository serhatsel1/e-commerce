const path = require("path");

const express = require("express");
//! dosya yolunu mainden çektik

const adminControllers = require("../controllers/admin")


const router = express.Router();

//! admin/add-product => GET
router.get("/add-product",adminControllers.getAddProduct);
//! admin/products => GET
router.get("/product", adminControllers.getProduct)
//! admin/add-product => POST
router.post("/add-product",adminControllers.postAddProducts);

module.exports = router;
// exports.routes = router;
// exports.products = products;
