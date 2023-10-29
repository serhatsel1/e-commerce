const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
  //! Html Sayfası içim
  // res.sendFile(path.join(rootDir,"views","add-product.html"))
  //! Pug sayfası için
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProducts = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProduct = (req, res, next) => {
  const products = Product.fetchAll();
  // console.log("selamm");
  // res.send("<h1>Hello From express !!</h1>");
  //!Html sayfasını yönledirmee
  // console.log("shop.js",adminData.product);
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  //! buradada pug dosyasını yönlendiriyoruz
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
  });
};
