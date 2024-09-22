const pool = require('../../db-config/mysql-config');

const tableName = 'elements';

const getElements = async (req, res) => {
  const getElementsPromise = new Promise((resolve, reject) => {
    const query = `
      SELECT 
        *
      FROM 
        ??
      ;`;

    const values = [tableName];

    return pool.query(query, values, (error, rows) => {
      if (error) {
        return reject(error);
      }

      return resolve(rows);
    });
  });

  try {
    const rows = await getElementsPromise;
    return res.send(JSON.stringify(rows));
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const addElement = async (req, res) => {
  const addElementPromise = new Promise((resolve, reject) => {
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
    await addElementPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const editElement = async (req, res) => {
  const editElementPromise = new Promise((resolve, reject) => {
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

    const values = [tableName, updatedValues, 'code', id];

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
    await editElementPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const removeElement = async (req, res) => {
  const removeElementPromise = new Promise((resolve, reject) => {
    const id = req.params.id;

    const query = `
      DELETE FROM
      ??
      WHERE
      ?? = ?
    `;

    const values = [tableName, 'code', id];

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
    await removeElementPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

module.exports = {
  getElements,
  addElement,
  editElement,
  removeElement,
};
