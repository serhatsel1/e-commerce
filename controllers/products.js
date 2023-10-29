const products = [];

exports.getAddProduct = (req, res, next) => {
  // console.log("add-product");
  //! Html Sayfası içim
  // res.sendFile(path.join(rootDir,"views","add-product.html"))
  //! Pug sayfası için
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProducts = (req, res, next) => {
  products.push({
    title: req.body.title,
  });
  res.redirect("/");
};

exports.getProduct = (req, res, next) => {
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


