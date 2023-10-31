const path = require("path");

const express = require("express");

const adminControllers = require("../controllers/admin")


const router = express.Router();

//! admin/add-product => GET
router.get("/add-product",adminControllers.getAddProduct);
//! admin/products => GET
router.get("/product", adminControllers.getProduct)
//! admin/add-product => POST
router.post("/add-product", adminControllers.postAddProducts);

router.get("/edit-product/:productId", adminControllers.getEditProduct);

router.get("/edit-product");

module.exports = router;
// exports.routes = router;
// exports.products = products;
