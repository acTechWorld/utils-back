// config/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '109.234.166.190', // e.g., 'localhost' or a remote IP address
  user: 'fule0038_utils-backend', // your database username
  password: 'utils-backend2024+', // your database password
  database: 'fule0038_utils-backend-bdd', // your database name
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0
});

module.exports = pool.promise(); // Use promise-based API