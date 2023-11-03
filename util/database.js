const mysql = require("mysql2");

const pool = mysql.createPool({
  host:"localhost",
  user: "root",
  database: "node-complete",
  password: "56530474958"
});


module.exports = pool.promise();