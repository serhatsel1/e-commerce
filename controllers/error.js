exports.getErr404 = (req, res, next) => {
  // res.status(404).sendFile(path.join(rootDir, "views", "err404.html"));

  res.status(404).render("err404",{pageTitle:"404Found",path:""});
} 
