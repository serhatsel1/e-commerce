const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

// const getDb = require("../util/database").getDb;
// class Product {
//   constructor(title, price, description, imgUrl) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imgUrl = imgUrl;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("products")
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = Product;
