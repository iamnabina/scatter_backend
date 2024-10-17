const mysql = require("mysql2/promise");

const port = process.env.DB_PORT;
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const db = mysql.createPool({
  host: host,
  port: port,
  user: user,
  password: password,
  database: database,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

module.exports = db;
