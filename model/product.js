const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  title: DataTypes.STRING,

  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },

  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


module.exports = Product;