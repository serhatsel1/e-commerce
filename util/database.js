const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "56530474958", {
  dialect: "mysql",
  host: "localhost",
});


module.exports = sequelize;