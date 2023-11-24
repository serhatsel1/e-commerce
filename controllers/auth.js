const User = require("../model/user");
const bcrypt = require("bcryptjs");
exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};
exports.getSignup = (req, res, next) => {
  try {
    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
    });
  } catch (error) {
    console.log("getSignup-->", error);
  }
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

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmpassword } = req.body;
    const userEmail = await User.find({ email: email });

    if (userEmail.length > 0) {
      console.log("User email exists -->", userEmail);
      return res.redirect("/signup?error=emailExists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });

    await user.save();
    return res.redirect("/login");
  } catch (error) {
    console.log("Post Signup error -->", error);
    res.redirect("/signup?error=unknown");
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("postLogout-->", err);
    res.redirect("/");
  });
};
