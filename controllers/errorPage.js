exports.getErr404 = (req, res, next) => {
  // res.status(404).sendFile(path.join(rootDir, "views", "err404.html"));

  res.status(404).render("err404", {
    pageTitle: "404Found",
    path: "",
    isAuthenticated: req.isLoggedIn,
  });
};

exports.getErr500 = (req, res, next) => {
  res.status(500).render("err500", {
    pageTitle: "500Found",
    path: "",
    isAuthenticated: req.isLoggedIn,
  });
};
