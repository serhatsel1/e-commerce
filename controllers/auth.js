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
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.redirect("/login");
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // save gerek yok fakat işi garantilemek için kullanılabilir
      return req.session.save((err) => {
        console.log("postLoginSave-->", err);
        res.redirect("/");
      });
    }
    res.redirect("/login");
  } catch (error) {
    console.log("postLogin-->", error);
    return res.redirect("/login");
  }
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
