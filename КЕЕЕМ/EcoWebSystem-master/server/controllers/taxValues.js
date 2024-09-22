const pool = require('../../db-config/mysql-config');

const tableName = 'tax_values';

const getTaxValues = async (req, res) => {
  const getTaxValuesPromise = new Promise((resolve, reject) => {
    const query = `
    SELECT 
      *
    FROM 
      ??;
    `;

    const values = [tableName];

    return pool.query(query, values, (error, rows) => {
      if (error) {
        return reject(error);
      }

      return resolve(rows);
    });
  });

  try {
    const rows = await getTaxValuesPromise;
    return res.send(JSON.stringify(rows));
  } catch (error) {
    return res.status(500).send({
      message: error,
    });
  }
};

const addTaxValue = async (req, res) => {
  const addTaxValuePromise = new Promise((resolve, reject) => {
    const query = `
      INSERT INTO
        ??
      VALUES
        (?)
    `;

    pool.query(query, [tableName, Object.values(req.body)], (error, rows) => {
      if (error) {
        return reject(error);
      }

      if (rows.affectedRows === 1) {
        return resolve();
      }
    });
  });

  try {
    await addTaxValuePromise;
    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const editTaxValue = async (req, res) => {
  const editTaxValuePromise = new Promise((resolve, reject) => {
    const id = req.params.id;
    const { body: updatedValues } = req;

    const query = `
      UPDATE
      ??
      SET
      ?
      WHERE
      ?? = ?
    `;

    const values = [tableName, updatedValues, 'id_of_element', id];

    pool.query(query, values, (error, rows) => {
      if (error) {
        return reject(error);
      }

      if (rows.affectedRows === 1) {
        return resolve();
      }
    });
  });

  try {
    await editTaxValuePromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const removeTaxValue = async (req, res) => {
  const removeTaxValuePromise = new Promise((resolve, reject) => {
    const id = req.params.id;

    const query = `
      DELETE FROM
      ??
      WHERE
      ?? = ?
    `;

    const values = [tableName, 'id_of_element', id];

    pool.query(query, values, (error, rows) => {
      if (error) {
        return reject(error);
      }

      if (rows.affectedRows === 1) {
        return resolve();
      }
    });
  });

  try {
    await removeTaxValuePromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

module.exports = {
  getTaxValues,
  addTaxValue,
  editTaxValue,
  removeTaxValue,
};
