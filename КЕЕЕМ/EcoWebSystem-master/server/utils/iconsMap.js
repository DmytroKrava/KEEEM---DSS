const { PUBLIC_IMAGES_URL } = require('./constants');
const pool = require('../../db-config/mysql-config');

const tableName = 'type_of_object';

const getImages = () => {
  const columnNames = ['id', 'Image_Name'];
  const query = `
    SELECT 
      ??
    FROM 
      ??
    ;`;

  const values = [columnNames, tableName];

  return new Promise((resolve, reject) => {
    pool.query(query, values, (error, rows) => {
      if (error) {
        reject(error);
      }

      const mappedIcons =
        rows &&
        rows.map(({ id, Image_Name }) => [
          id,
          `${PUBLIC_IMAGES_URL}/${Image_Name}`,
        ]);

      resolve(new Map(mappedIcons));
    });
  });
};

module.exports = getImages;
