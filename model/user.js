const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  // Kullanıcının sepetinde eklemek istediği ürünün index'ini bulma
  const cartProductIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );

  // Eğer ürün sepette varsa, miktarını bir artır, yoksa yeni bir ürünü sepete ekle
  if (cartProductIndex !== -1) {
    // Sepette varsa, miktarı artır
    this.cart.items[cartProductIndex].quantity += 1;
  } else {
    // Yoksa yeni bir ürünü sepete ekle
    this.cart.items.push({
      productId: product._id,
      quantity: 1,
    });
  }

  // Kullanıcının sepetini kaydet
  return this.save();
};

userSchema.methods.removeCartItem = function (productId) {
  const updateCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });

  this.cart.items = updateCartItems;

  // Kullanıcının sepetini kaydet
  return this.save();
};


userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = require("../util/database");

// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//   },
//   email: {
//     type: Sequelize.STRING,
//   },
// });

// module.exports = User;
