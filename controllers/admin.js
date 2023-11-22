const Product = require("../model/product");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    // Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const { productId, title, price, imageUrl, description } = req.body;

    await Product.findByIdAndUpdate(
      { _id: productId },
      { title, price, imageUrl, description }
    );

    console.log("UPDATED PRODUCT!");
    res.redirect("/admin/products");
  } catch (error) {
    console.log("postEditProductError -->", error);
  }
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .select("price")
    .populate("userId")
    .then((products) => {
      console.log(products);
      res.render("admin/product", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/product",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    await Product.findByIdAndDelete(prodId);
    console.log("DESTROYED PRODUCT");
    res.redirect("/admin/products");
  } catch (error) {
    console.log("postDeleteProductError -->", error);
  }
};
