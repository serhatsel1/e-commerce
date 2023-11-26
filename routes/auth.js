const express = require("express");
const authControllers = require("../controllers/auth");
const router = express.Router();

router
  .get("/login", authControllers.getLogin)
  .get("/signup", authControllers.getSignup)
  .post("/login", authControllers.postLogin)
  .post("/signup", authControllers.postSignup)
  .post("/logout", authControllers.postLogout)
  .get("/reset", authControllers.getReset)
  .post("/reset", authControllers.postReset)
  .get("/reset/:token", authControllers.getNewPassword)
  .post("/new-password", authControllers.postNewPassword);

module.exports = router;
