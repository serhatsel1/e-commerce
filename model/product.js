const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);
const getProductFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    getProductFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log("err data :", err);
      });
    });
    // const p = path.join(
    //   path.dirname(require.main.filename),
    //   "data",
    //   "products.json"
    // );
  }

  static fetchAll(cb) {
    getProductFile(cb);
  }
};
