const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");

router
.get("/login",authControllers.getLogin)
.post("/login",authControllers.postLogin)
.post("/logout",authControllers.postLogout)

module.exports = router; 
