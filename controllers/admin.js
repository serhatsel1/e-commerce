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
  const product = new Product(title, price, description, imgUrl);
  product
    .save()
    .then((result) => {
      res.redirect("/admin/product");
      console.log("postAddProduct :", result);
    })
    .catch((err) => {
      console.log("postAddProduct :", err);
    });
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect("/");
//   }
//   const prodId = req.params.productId;
//   req.user
//     .getProducts({ where: { id: prodId } })
//     // Product.findByPk(prodId)
//     .then((products) => {
//       const product = products[0]
//       if (!product) {
//         return res.redirect("/");
//       }
//       res.render("admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product,
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImgUrl = req.body.imgUrl;
//   const updatedDesc = req.body.description;
//   Product.findByPk(prodId)
//     .then((product) => {
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.description = updatedDesc;
//       product.imgUrl = updatedImgUrl;
//       return product.save();
//     })
//     .then((result) => {
//       console.log("UPDATED PRODUCT");
//       res.redirect("/admin/product");
//     })
//     .catch((err) => console.log(err));
// };
// exports.getProduct = (req, res, next) => {
//   // Product.findAll()
//   req.user.getProducts()
//     .then((products) => {
//       res.render("admin/product", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/product",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   // Product.fetchAll((products) => {
//   //   res.render("admin/product", {
//   //     prods: products,
//   //     pageTitle: "Admin Products",
//   //     path: "/admin/product",
//   //   });
//   // });
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId)
//     .then((product) => {
//       return product.destroy();
//     })
//     .then((result) => {
//       console.log("DESTROYED PRODUCT");
//       res.redirect("/admin/product");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
