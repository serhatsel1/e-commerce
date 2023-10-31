const Product = require("../model/product");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing:false
  });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imgUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!(editMode ==="true")) {
    console.log(editMode)
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if(!product){
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product:product
    });
  });
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
