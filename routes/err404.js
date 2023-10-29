const express = require("express");
const path = require("path");
const rootDir = require("../util/path");

const router = express.Router();

router.use((req, res, next) => {
  // res.status(404).sendFile(path.join(rootDir, "views", "err404.html"));

  
  res.status(404).render("err404",{pageTitle:"404Found"});
});

module.exports = router;
