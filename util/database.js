const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGODB_URI)
    .then((result) => {
      console.log("Connected MngoDB !");
      // _db = client.db("test")
      _db = result.db("test");
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found !";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
