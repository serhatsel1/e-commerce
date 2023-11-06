const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const Product = require("./model/product");
const User = require("./model/user");
const Cart = require("./model/cart");
const CartItem = require("./model/cart-item");
const Order = require("./model/order");
const OrderItem = require("./model/order-item");
const app = express();

//! ejs

app.set("view engine", "ejs");
app.set("views", "views");
//! pug js için
// app.set("view engine","pug");
// app.set("views","views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const err404Routes = require("./routes/err404");
// const Cart = require("./model/cart");

const hostName = "127.0.0.1";
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

//! static olan css dosyaları için
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

//! dosyalardan veri çekme
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(err404Routes);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  //! Tabloların üzerine yazmak için
  // .sync({force:true})
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "serhat", email: "selserhat@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();
    // console.log(`Server çalışıyor --> http://${hostName}:${port}`);
  })
  .then((cart) => {
    return app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
// app.listen(port);
