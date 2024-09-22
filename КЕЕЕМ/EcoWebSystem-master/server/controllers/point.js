const pool = require('../../db-config/mysql-config');
const { insertEmissionOnMap, SOURCE_POI } = require('./emissionsOnMap');
const isEmpty = require('is-empty');

const addPoint = (req, res) => {
  const {
    Name_object,
    type,
    coordinates,
    description,
    emission,
    id_of_user,
    owner_type_id: owner_type,
  } = req.body;

  const query = `
  INSERT INTO poi 
  (id_of_user, Type, owner_type, Coord_Lat, Coord_Lng, Description, Name_object)
  VALUES ('${id_of_user}', '${type}', '${owner_type}','${coordinates[0]}', '${coordinates[1]}', '${description}', '${Name_object}');
  `;

  const pointPromise = new Promise((resolve, reject) => {
    pool.query(query, (error, rows) => {
      if (error) {
        reject(error);
      } else if (isEmpty(rows)) {
        error = Error('Wrong input data');
        reject(error);
      } else {
        resolve(+rows.insertId);
      }
    });
  });

  return pointPromise
    .then((insertedId) => {
      if (!!emission) {
        emission.idPoi = insertedId;
        return insertEmissionOnMap(SOURCE_POI, emission);
      }
    })
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: error,
      });
    });
};

const getPoint = (req, res) => {
  const id = req.params.id;
  const poiPromise = new Promise((resolve, reject) => {
    const query = `
    SELECT 
      id_of_user, 
      poi.type,
      description, 
      Name_object, 
      owner_type as owner_type_id, 
      owner_types.type as owner_type_name
    FROM 
      poi
    INNER JOIN 
      owner_types 
    ON 
      poi.owner_type = owner_types.id  
    WHERE 
      poi.Id = ${id} 
    ;`;

    pool.query(query, [], (error, rows) => {
      if (error) {
        reject(error);
      }

      rows = rows.map(
        ({
          id_of_user,
          type,
          description,
          Name_object,
          owner_type_id,
          owner_type_name,
        }) => {
          return {
            id_of_user,
            type,
            description,
            Name_object,
            owner_type: {
              id: owner_type_id,
              name: owner_type_name,
            },
          };
        }
      );

      if (rows[0]) {
        resolve(rows[0]);
      }
    });
  });

  return poiPromise
    .then((poi) => res.send(poi))
    .catch((error) => res.status(500).send({ message: error }));
};

const updatePoint = (req, res) => {
  const id = req.params.id;
  const {
    Name_object,
    description,
    type,
    emission,
    owner_type_id: owner_type,
  } = req.body;

  const poiPromise = new Promise((resolve, reject) => {
    const tableName = 'poi';
    const updatedValues = {
      Name_object,
      description,
      type,
      owner_type,
    };

    const query = `
      UPDATE
      ??
      SET
      ?
      WHERE
      ?? = ?
    `;

    const values = [tableName, updatedValues, 'Id', id];

    pool.query(query, values, (error, rows) => {
      if (error) {
        reject(error);
      }

      if (rows) {
        resolve();
      }
    });
  });

  return poiPromise
    .then(() => {
      if (!!emission) {
        emission.idPoi = +id;
        return insertEmissionOnMap(SOURCE_POI, emission);
      }
    })
    .then(() => res.sendStatus(200))
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports = {
  addPoint,
  getPoint,
  updatePoint,
};
