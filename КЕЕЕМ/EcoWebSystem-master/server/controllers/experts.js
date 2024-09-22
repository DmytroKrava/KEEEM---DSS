const pool = require('../../db-config/mysql-config');

const getExperts = (req, res) => {
  const query = `
  SELECT 
    *
  FROM 
    ??
  ;`;

  const values = ['expert'];

  return pool.query(query, values, (error, rows) => {
    if (error) {
      return res.status(500).send({
        message: error,
      });
    }

    return res.send(JSON.stringify(rows));
  });
};

module.exports = {
  getExperts,
};
