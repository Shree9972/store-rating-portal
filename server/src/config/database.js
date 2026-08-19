const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
});

const testDatabaseConnection = async () => {
  try {

    //console.log("DB_HOST:", process.env.DB_HOST);
    //console.log("DB_USER:", process.env.DB_USER);
    //console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
    //console.log("DB_NAME:", process.env.DB_NAME);
    //console.log("DB_PORT:", process.env.DB_PORT);

    const connection = await pool.getConnection();

    console.log("MySQL database connected successfully");

    connection.release();
  } catch (error) {
    console.error("MySQL database connection failed:");
    console.error(error.message);

    process.exit(1);
  }
};

module.exports = {
  pool,
  testDatabaseConnection,
};