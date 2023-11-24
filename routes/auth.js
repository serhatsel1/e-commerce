const express = require("express");
const authControllers = require("../controllers/auth");
const router = express.Router();

router
.get("/login",authControllers.getLogin)
.get('/signup', authControllers.getSignup)
.post("/login",authControllers.postLogin)
.post('/signup', authControllers.postSignup)
.post("/logout",authControllers.postLogout)

module.exports = router; 
