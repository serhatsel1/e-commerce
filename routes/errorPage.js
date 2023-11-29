const express = require("express");
const errorPage = require("../controllers/errorPage");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

// router.use(isAuth);

router.use("/500", errorPage.getErr500).use(errorPage.getErr404);

module.exports = router;
