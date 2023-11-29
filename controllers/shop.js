const fs = require("fs");
const path = require("path");

const Product = require("../model/product");
const Order = require("../model/order");
const User = require("../model/user");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })

    .catch((err) => {
      const error = new Error();
      error.httpStatusCode = 500;
      console.log(err);
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "cart.items.productId"
    );

    console.log("getCart", user.cart.items);
    const products = user.cart.items;

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
    });
  } catch (error) {
    console.error(error);
    const err = new Error("Internal Server Error");
    err.httpStatusCode = 500;
    return next(err);
  }
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeCartItem(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");

    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });

    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user,
      },
      products: products,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (error) {
    console.log(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id });
    console.log("orders", orders);

    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });

    // if (orders.length > 0) {
    //   orders.forEach((order) => {
    //     const orderProducts = order.products.map((product) => product.title);
    //     console.log("Order Products:", orderProducts);
    //     // Burada orderProducts'ı kullanabilir veya başka işlemler yapabilirsiniz.
    //   });
    // }
  } catch (error) {
    console.log("getOrders-->", error);
    // error.httpStatusCode = 500;
    // return next(error);
  }
};

exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId);
  console.log("orderId --->", orderId);
  try {
    if (!order) {
      const error = new Error("No order found");
      console.log(error);
      return next(error);
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      const error = new Error("Unauthorized");
      console.log(error);
      return next(error);
    }
    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);
    fs.readFile(invoicePath, (err, data) => {
      if (err) {
        console.log("getInvoice-->", err);
        return next(err);
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        /*attachment*/ 'inline; filename="' + invoiceName + '"'
      );
      res.send(data);
    });
  } catch (error) {
    console.log("getInvoice-->", error);
    next(error);
  }
};
