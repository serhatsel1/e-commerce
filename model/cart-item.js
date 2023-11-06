const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Cart = sequelize.define("cartItem", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Cart;
