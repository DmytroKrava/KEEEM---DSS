const mysql = require('mysql');
const pool = mysql.createPool({
  multipleStatements: true,
  host: 'localhost',
  user: 'USER_NAME',
  password: 'PASSWORD_NAME',
  database: 'DATABASE_NAME',
  port: '3306',
});

module.exports = pool;
