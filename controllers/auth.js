const User = require("../model/user");

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("655e19584de42ed015c18121")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // save gerek yok fakat işi garantilemek için kullanılabilir
      req.session.save((err) => {
        console.log("postLogin-->", err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("postLogout-->", err);
    res.redirect("/");
  });
};
