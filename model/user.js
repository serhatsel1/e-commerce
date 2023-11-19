const mongoose = require("mongoose");
const product = require("./product");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
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
        quantity: { type: Number, reuqired: true },
      },
    ],
  },
});

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
