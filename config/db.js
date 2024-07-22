// config/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.BDD_HOST,
  user: process.env.BDD_USER,
  password: process.env.BDD_PASSWORD,
  database: process.env.BDD_DATABASE,
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0
});

module.exports = pool.promise(); // Use promise-based API