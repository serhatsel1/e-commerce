const Product = require("../model/product");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imgUrl, description, price);
  product.save()
  .then(() => {
    res.redirect("/");
  })
  .catch( err => console.log(err));
  
};


exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
        return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImgUrl = req.body.imgUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImgUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect('/admin/product');
};
exports.getProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/product", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/product",
    });
  });
};

exports.postDeleteProduct = (req,res,next) => {
  const prodId = req.body.productId; 
  Product.deleteById(prodId);
  res.redirect("/admin/product");
}
