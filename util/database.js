const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://selserhat01:56530474958s@cluster0.vyic7gs.mongodb.net/shop?retryWrites=true&w=majority"
  )
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
  if(_db){
    return _db
  }
  throw "No database found !"
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
