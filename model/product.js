const getDb = require("../util/database").getDb;
class Product {
  constructor(title, price, description, imgUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imgUrl = imgUrl;
  }

  save() {
    const db = getDb();
    db.collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

// const Product = sequelize.define("product", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//     allowNull: false,
//   },

//   title: DataTypes.STRING,

//   price: {
//     type: DataTypes.DOUBLE,
//     allowNull: false,
//   },

//   imgUrl: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

module.exports = Product;
