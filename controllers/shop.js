const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Product = require("../model/product");
const Order = require("../model/order");
const User = require("../model/user");
const product = require("../model/product");

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numOfProduct) => {
      totalItems = numOfProduct;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        haspreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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

exports.getIndex = async (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((numOfProduct) => {
      totalItems = numOfProduct;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE) // 1 * 2 = 2 ürünü atla diğer satıra 2 ürün atlanarak başla
        .limit(ITEMS_PER_PAGE); // her sayfayı 2 ürünle sınırla
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        haspreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
    // atCreat = orders.createdAt.split("-");
    // console.log("atCreat--->", atCreat);
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
    const imagePath = path.join("privateImage", "ben.jpg");

    const pdfDoc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      /*attachment*/ 'inline; filename="' + invoiceName + '"'
    );
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text("Invoice", { underline: true, align: "left" });

    pdfDoc
      .image(imagePath, {
        fit: [300, 300],
        valign: "center",
      })
      .fill("rgba(255, 255, 255, 0.5),", "even-odd"); // Dikdörtgenin içini beyazla doldurun (50% opaklık)

    pdfDoc.text("---------------------------------");
    let totalprice = 0;
    order.products.forEach((prod) => {
      totalprice += prod.quantity * prod.product.price;
      pdfDoc
        .fontSize(14)
        .text(
          prod.product.title +
            " - " +
            " $" +
            prod.product.price +
            " x " +
            prod.quantity
        );
    });
    pdfDoc.text("--------");
    pdfDoc.text(" ");
    pdfDoc.fontSize(20).text("Total Price: $" + totalprice);

    pdfDoc.end();
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     console.log("getInvoice-->", err);
    //     return next(err);
    //   }
    //   res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader(
    //     "Content-Disposition",
    //     /*attachment*/ 'inline; filename="' + invoiceName + '"'
    //   );
    //   res.send(data);
    // });
    // const file = fs.createReadStream(invoicePath);

    // file.pipe(res);
  } catch (error) {
    console.log("getInvoice-->", error);
    next(error);
  }
};
