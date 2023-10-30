const Product = require("../model/product");


exports.getProduct = (req, res, next) => {
  const products = Product.fetchAll((products) => {
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


exports.getIndex = (req,res,next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });

  });

  
}

exports.getCart = (req,res,next) =>{
  res.render("shop/cart",{
    pageTitle: "Your Card",
    path:"/cart"
  });
}

exports.getCheckout = (req,res,next) =>{

  res.render("shop/checkout",{
    path: "/checkout",
    pageTitle :"Checkout"
  })

}