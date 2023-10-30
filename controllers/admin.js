const Product = require("../model/product");
exports.getAddProduct = (req, res, next) => {
  //! Html Sayfası içim
  // res.sendFile(path.join(rootDir,"views","add-product.html"))
  //! Pug sayfası için
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title,imgUrl,description,price);
  product.save();
  res.redirect("/");
};

exports.getProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/product", {
      prods: products,
      pageTitle: "Admin Product",
      path: "/admin/product",
    });
  });
};
