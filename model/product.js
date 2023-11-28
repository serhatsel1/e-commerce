const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      validate: {
        validator: (value) => validator.isAlphanumeric(value),
        message: "Title must be alphanumeric",
      },
      minlength: [3, "Title must be at least three characters"],
      maxlength: [35, "Title can be at most thirty five characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      validate: {
        validator: (value) => /^\d+(\.\d{1,2})?$/.test(value),
        message: "Price must be a valid number with up to two decimal places",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      minlength: [5, "Description must be at least five characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required."],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// productSchema.pre("findOneAndUpdate", async function (next) {
//   const update = this.getUpdate();
//   const productId = update?._id;
//   console.log("productId-->", productId);
//   // productId'yi kullanarak ilgili ürünü bul
//   const product = await this.model.findById(productId);
//   console.log("product-->", product);

//   if (!product) {
//     // Ürün bulunamazsa hata döndür
//     const error = new Error("Product not found");
//     error.statusCode = 404;
//     return next(error);
//   }

//   const validationError = new mongoose.Error.ValidationError(product);

//   // Title validation
//   if (
//     !update.title ||
//     typeof update.title !== "string" ||
//     update.title.length < 3 ||
//     update.title.length > 35
//   ) {
//     validationError.errors.title = new mongoose.Error.ValidatorError({
//       message: "Title must be a string between 3 and 35 characters",
//       path: "title",
//       value: update.title,
//     });
//   }

//   // Price validation
//   if (
//     !update.price ||
//     typeof update.price !== "number" ||
//     !/^\d+(\.\d{1,2})?$/.test(update.price)
//   ) {
//     validationError.errors.price = new mongoose.Error.ValidatorError({
//       message: "Price must be a valid number with up to two decimal places",
//       path: "price",
//       value: update.price,
//     });
//   }

//   // Description validation
//   if (
//     !update.description ||
//     typeof update.description !== "string" ||
//     update.description.length < 5
//   ) {
//     validationError.errors.description = new mongoose.Error.ValidatorError({
//       message: "Description must be a string with at least five characters",
//       path: "description",
//       value: update.description,
//     });
//   }

//   // UserId validation (assuming valid ObjectId)
//   if (
//     !update.userId ||
//     typeof update.userId !== "object" ||
//     update.userId.constructor.name !== "ObjectId"
//   ) {
//     validationError.errors.userId = new mongoose.Error.ValidatorError({
//       message: "Invalid UserId",
//       path: "userId",
//       value: update.userId,
//     });
//   }

//   // Check if there are validation errors
//   if (Object.keys(validationError.errors).length > 0) {
//     next(validationError);
//   } else {
//     next();
//   }
// });

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
