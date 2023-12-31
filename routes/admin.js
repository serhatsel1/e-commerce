const path = require("path");

const express = require("express");

const adminControllers = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//kimlik doğrulama
router.use(isAuth);

//! admin/add-product => GET
router.get("/add-product", adminControllers.getAddProduct);
//! admin/products => GET
router.get("/product", adminControllers.getProducts);
//! admin/add-product => POST
router.post("/add-product", adminControllers.postAddProduct);

router.get("/edit-product/:productId", adminControllers.getEditProduct);

router.post("/edit-product", adminControllers.postEditProduct);

router.delete("/product/:productId", adminControllers.deleteProduct);

module.exports = router;
// exports.routes = router;
// exports.products = products;
