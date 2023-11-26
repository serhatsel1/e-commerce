module.exports = (req, res, next) => {
  console.log("req.session.isloggedIn",req.session.isloggedIn)
  if (!req.session.isloggedIn) {
    return res.redirect("/login");
  }
  next();
};
