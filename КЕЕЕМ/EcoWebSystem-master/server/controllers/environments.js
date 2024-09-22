const pool = require('../../db-config/mysql-config');

const tableName = 'environment';

const getEnvironments = async (req, res) => {
  const getEnvironmentsPromise = new Promise((resolve, reject) => {
    const query = `
      SELECT 
        *
      FROM 
        ??
      where AttachEnv = 0
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
    const rows = await getEnvironmentsPromise;
    return res.send(JSON.stringify(rows));
  } catch (error) {
    return res.status(500).send({
      message: error,
    });
  }
};

const addEnvironment = async (req, res) => {
  const addEnvironmentPromise = new Promise((resolve, reject) => {
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
    await addEnvironmentPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const editEnvironment = async (req, res) => {
  const editEnvironmentPromise = new Promise((resolve, reject) => {
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

    const values = [tableName, updatedValues, 'id', id];

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
    await editEnvironmentPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const removeEnvironment = async (req, res) => {
  const removeEnvironmentPromise = new Promise((resolve, reject) => {
    const id = req.params.id;

    const query = `
      DELETE FROM
      ??
      WHERE
      ?? = ?
    `;

    const values = [tableName, 'id', id];

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
    await removeEnvironmentPromise;
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

module.exports = {
  getEnvironments,
  addEnvironment,
  editEnvironment,
  removeEnvironment,
};
