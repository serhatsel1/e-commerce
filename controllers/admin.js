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
  const { title, price, description } = req.body;
  const image = req.file;
  // const imageUrl = image.path;
  try {
    if (!image) {
      req.flash("error", "Attached file is not an image!");
      return res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: {
          title: title,
          price: price,
          description: description,
        },
        editError: req.flash("error"),
        errorStyle: "price",
      });
    }

    const imageUrl = image.path;
    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user,
    });

    await product.save();
    console.log("Created Product");
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error);

    if (error.name === "ValidationError") {
      req.flash("error", error.message);

      return res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: {
          title: title,
          price: price,
          description: description,
          imageUrl: image ? image.path : null,
        },
        editError: req.flash("error"),
        errorStyle: error.errors ? Object.keys(error.errors)[0] : null,
      });
    } else {
      error.httpStatusCode = 500;
      next(error);
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
    .catch((err) => {
      console.log(err);
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = async (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
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
      imageUrl: image ? image.path : product.imageUrl,
      // imageUrl: updatedImageUrl,
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
          // imageUrl: updatedImageUrl,
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
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    await Product.deleteOne({ _id: prodId, userId: req.user._id });
    console.log("DESTROYED PRODUCT");
    res.redirect("/admin/products");
  } catch (error) {
    console.log("postDe leteProductError -->", error);
    error.httpStatusCode = 500;
    return next(error);
  }
};
