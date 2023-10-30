const Product = require("../model/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Product",
      path: "/products",
    });
    // console.log("selamm");
    // res.send("<h1>Hello From express !!</h1>");
    //!Html sayfasını yönledirmee
    // console.log("shop.js",adminData.product);
    // res.sendFile(path.join(rootDir, "views", "shop.html"));
    //! buradada pug dosyasını yönlendiriyoruz
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    res.render("shop/product-details", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Your Card",
    path: "/cart",
  });
};

exports.postCard = (req,res,next) => {
  const prodId = req.body.productId;
  console.log(prodId)
  res.redirect("/cart");
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};
