const mysql = require('mysql');
const pool = mysql.createPool({
  multipleStatements: true,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: 'localhost',
  user: 'root',
  password: 'D1mon2020',
  database: 'keeem_local',
  port: '3306',
});
module.exports = pool;
















/*const mysql = require('mysql');
const pool = mysql.createPool({
  multipleStatements: true,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: 'keem.com.ua',
  user: 'h34471c_All',
  password: 'Keem_Kpi',
  database: 'h34471c_Work',
  port: '3306',
});

//database: 'h34471c_Work' главная  "h34471c_KPI_KEEM" второстепенная
module.exports = pool;*/
