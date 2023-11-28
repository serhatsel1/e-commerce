const product = require("../model/product");
const Product = require("../model/product");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    //! oldinput product
    product: {
      title: "",
      price: "",
      description: "",
      imageUrl: "",
    },
    editError: req.flash("error"),
    errorStyle: "",
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  try {
    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user,
    });
    await product.save();
    // console.log(result);
    console.log("Created Product");
    res.redirect("/admin/product");
  } catch (error) {
    if (error.name === "ValidationError" && error.errors.title) {
      req.flash("error", error.errors.title.message);
      return res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: {
          title: title,
          price: price,
          description: description,
          imageUrl: imageUrl,
        },
        editError: req.flash("error"),
        errorStyle: "title",
      });
    }
    if (error.name === "ValidationError" && error.errors.price) {
      req.flash("error", error.errors.price.message);
      return res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: {
          title: title,
          price: price,
          description: description,
          imageUrl: imageUrl,
        },
        editError: req.flash("error"),
        errorStyle: "price",
      });
    }
    if (error.name === "ValidationError" && error.errors.description) {
      req.flash("error", error.errors.description.message);
      return res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: {
          title: title,
          price: price,
          description: description,
          imageUrl: imageUrl,
        },
        editError: req.flash("error"),
        errorStyle: "description",
      });
    }
  }
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
        editError: [],
        errorStyle: "",
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = async (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.redirect("/");
    }

    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }

    // Eski ürünü sil
    await Product.findByIdAndDelete(productId);

    // Yeni ürünü güncelle
    const updatedProduct = new Product({
      _id: productId,
      title: updatedTitle,
      price: updatedPrice,
      description: updatedDesc,
      imageUrl: updatedImageUrl,
      userId: req.user._id,
    });

    // Veritabanında güncelleme
    await updatedProduct.save();

    console.log("UPDATED PRODUCT!");
    res.redirect("/admin/product");
  } catch (error) {
    if (error.name === "ValidationError" && error.errors.title) {
      req.flash("error", error.errors.title.message);
      return res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: {
          title: updatedTitle,
          price: updatedPrice,
          description: updatedDesc,
          imageUrl: updatedImageUrl,
        },
        editError: req.flash("error"),
        errorStyle: "title",
      });
    }
    if (error.name === "ValidationError" && error.errors.price) {
      req.flash("error", error.errors.price.message);
      return res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: {
          title: title,
          price: price,
          description: description,
          imageUrl: imageUrl,
        },
        editError: req.flash("error"),
        errorStyle: "price",
      });
    }
    if (error.name === "ValidationError" && error.errors.description) {
      req.flash("error", error.errors.description.message);
      return res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: {
          title: title,
          price: price,
          description: description,
          imageUrl: imageUrl,
        },
        editError: req.flash("error"),
        errorStyle: "description",
      });
    }
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user._id });
    // console.log(products);
    res.render("admin/product", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/product",
    });
  } catch (error) {
    console.log("getProducts-->", error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    await Product.deleteOne({ _id: prodId, userId: req.user._id });
    console.log("DESTROYED PRODUCT");
    res.redirect("/admin/products");
  } catch (error) {
    console.log("postDeleteProductError -->", error);
  }
};
