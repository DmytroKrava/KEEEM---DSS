const axios = require('axios');
const json = require('./ukraine_geojson-master/Crimea.json');
const pool = require('../../../db-config/mysql-config');
const { removeDuplicates } = require('../duplicateRemover');

query = `INSERT INTO point_poligon (longitude, latitude, Id_of_poligon, order123) VALUES`;

console.log(json.geometry.coordinates[0].length);

let oblast = removeDuplicates(json.geometry.coordinates[0]);

console.log(oblast.length);

oblast.forEach((el, i) => {
  if (i < oblast.length - 1) {
    query += `(${el[1]}, ${el[0]}, ${28} ,${i})`;
  }
  if (i < oblast.length - 2) {
    query += ', ';
  }
});

pool.query(query, (err) => {
  if (err) {
    console.log(err);
  }
});
