const express = require("express");
const errorPage = require("../controllers/error");

const router = express.Router();

router.use(errorPage.getErr404);

module.exports = router;
