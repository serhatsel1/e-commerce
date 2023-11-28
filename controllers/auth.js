const { error } = require("console");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { DATE } = require("sequelize");

exports.getLogin = async (req, res, next) => {
  await res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
    passwordErrorMessage: req.flash("passwordError"),
  });
};

exports.getSignup = (req, res, next) => {
  try {
    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      emailErrorMessage: req.flash("error"),
      oldInput: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      errorStyle: "",
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
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.isLoggedIn = true;
      console.log("req.session.isLoggedIn", req.session.isLoggedIn);
      req.session.user = user;
      // save gerek yok fakat işi garantilemek için kullanılabilir
      return req.session.save((err) => {
        console.log("postLoginSave-->", err);
        res.redirect("/");
      });
    } else {
      req.flash("passwordError", "Hatalı şifre");
    }
    res.redirect("/login");
  } catch (error) {
    console.log("postLogin-->", error);
    res.redirect("/login");
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const userEmail = await User.find({ email: email });

    if (userEmail.length > 0) {
      req.flash(
        "error",
        "E-mail is already taken, please pick a different one"
      );
      return res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        emailErrorMessage: req.flash("error"),
        oldInput: {
          email: email,
        },
        errorStyle: "emailError",
      });
    }

    if (
      password.toString() !== confirmPassword.toString() ||
      password.length < 4
    ) {
      req.flash("error", "Invalid password");
      return res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        emailErrorMessage: req.flash("error"),
        oldInput: {
          email: email,
        },
        errorStyle: "passwordError",
      });
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
    const email = req.body.email;
    console.log("Post Signup error -->", error);

    if (error.name === "ValidationError" && error.errors.email) {
      // Eğer hata bir ValidatorError ve email hatası varsa
      // const emailErrorText = error.errors.email.message;
      req.flash("error", error.errors.email.message);
      return res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        emailErrorMessage: req.flash("error"),
        oldInput: {
          email: email,
        },
        errorStyle: "emailError",
      });
    }
    if (error.name === "ValidationError" && error.errors.password) {
      req.flash("error", error.errors.password.message);
      return res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        emailErrorMessage: req.flash("error"),
        oldInput: {
          email: "passwordError",
        },
        errorStyle: "inputError",
      });
    }

    // Diğer hatalar için genel bir hata mesajı kullanıcıya gönderilebilir
    req.flash("error", "An error occurred. Please try again later.");
    return res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      emailErrorMessage: req.flash("error"),
      oldInput: {
        email: email,
      },
    });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("postLogout-->", err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "Password Reset",
    path: "/reset",
    errorMessage: req.flash("error"),
  });
};
exports.postReset = async (req, res, next) => {
  crypto.randomBytes(32, async (err, buf) => {
    if (err) {
      console.log("postReset-->", err);
      return res.redirect("/reset");
    }
    const token = buf.toString("hex");
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "No account with that email found.");
      return res.redirect("/reset");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; //1 saat geçerli
    await user.save();

    // htmlTemplate içinde ${token} doğru bir şekilde kullanılmıştır.
    const htmlTemplate = `
      <!doctype html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Simple Transactional Email</title>
        <style>
          /* Stil ve CSS ayarları buraya gelebilir */
        </style>
      </head>
      <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">
                <!-- START CENTERED WHITE CONTAINER -->
                <table role="presentation" class="main">
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="wrapper">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <p>Name: ${req.body.email}</p>
                            <p>Message: Parolayı sıfırlama talebinde bulundunuz</p>
                            <p>Message: yeni parolayı belirlemek için bu <a href="http://localhost:3000/reset/${token}">linke</a> tıklayınız </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- END MAIN CONTENT AREA -->
                </table>
                <!-- END CENTERED WHITE CONTAINER -->
              </div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.NODE_PASS,
        },
      });

      await transporter.sendMail({
        to: process.env.EMAIL,
        subject: `Password Reset`,
        html: htmlTemplate,
      });
    } catch (error) {
      console.log("E-posta gönderme hatası:", error);
    }

    // E-posta gönderildikten sonra ana sayfaya yönlendir
    res.redirect("/");
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    console.log(user._id);
    res.render("auth/new-password", {
      pageTitle: "New password",
      path: "/new-password",
      errorMessage: req.flash("error"),
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (error) {
    console.log("getNewPassword-->", error);
  }
};
exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const { passwordToken, userId } = req.body;

  const user = await User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  });

  if (user) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect("/login");
  }
};
