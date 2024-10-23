const { Sequelize } = require("sequelize");
require("dotenv").config();

// Load environment variables
const MYSQL_HOST = process.env.MYSQL_HOST || "localhost";
const MYSQL_PORT = process.env.MYSQL_PORT || 3306;
const MYSQL_USERNAME = process.env.MYSQL_USERNAME || "root";
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "admin";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "user";

console.log(MYSQL_HOST, MYSQL_PORT, MYSQL_USERNAME, MYSQL_PASSWORD);

// Initialize Sequelize with MySQL database
const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    dialect: "mysql",
});

module.exports = sequelize;
