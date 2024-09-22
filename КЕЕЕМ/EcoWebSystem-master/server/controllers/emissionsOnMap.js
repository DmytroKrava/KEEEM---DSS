const pool = require('../../db-config/mysql-config');

const { formatDateForDatabase } = require('../utils/formatDateForDatabase');

const tableName = 'emissions_on_map';
const SOURCE_POI = 'poi';
const SOURCE_POLYGON = 'polygon';

const insertEmissionOnMap = (source, emission) => {
  const {
    idPoi,
    idElement,
    idEnvironment,
    valueAvg,
    valueMax,
    idPolygon,
    year,
    month,
    day,
    measure,
  } = emission;
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO 
        ??
        (??)
      VALUES
        (?)`;

    const columnNames = [
      'idElement',
      'idEnvironment',
      'ValueAvg',
      'ValueMax',
      'Year',
      'Month',
      'day',
      'Measure',
    ];
    const values = [
      idElement,
      idEnvironment,
      valueAvg,
      valueMax,
      year,
      month,
      day,
      measure,
    ];
    if (source === SOURCE_POI) {
      columnNames.push('idPoi');
      values.push(idPoi);
    } else if (source === SOURCE_POLYGON) {
      columnNames.push('idPoligon');
      values.push(idPolygon);
    }

    const parameters = [tableName, columnNames, values];
    pool.query(query, parameters, (error) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
};

const getEmissionsOnMap = (source, id, idEnvironment,limit) => {
  let filteringColumnName, idEnvironmentClause;
  if (source === SOURCE_POI) {
    filteringColumnName = 'idPoi';
  } else if (source === SOURCE_POLYGON) {
    filteringColumnName = 'idPoligon';
  }

  if (idEnvironment && Array.isArray(idEnvironment)) {
    idEnvironmentClause = 'AND ';
    idEnvironment.forEach((el,i) => {
      //idEnvironmentClause+= (i==idEnvironment.length-1)?`emissions_on_map.idEnvironment = ${el}) `:`emissions_on_map.idEnvironment = ${el} or `
      idEnvironmentClause+= (i==idEnvironment.length-1)?
      `environment.id = ${el} or environment.AttachEnv =${el} `:
      `environment.id = ${el} or environment.AttachEnv =${el} or `
      // `emissions_on_map.idEnvironment = ${el}) `:
      // `emissions_on_map.idEnvironment = ${el} or `
    });
  } else if(idEnvironment) {
    //idEnvironmentClause =' AND ?? = ? '
    idEnvironmentClause =`AND environment.id = ${idEnvironment} or environment.AttachEnv =${idEnvironment} `
  }else{
    idEnvironmentClause='';
  }

  return new Promise((resolve, reject) => {
    const emissionsOnMapTable = 'emissions_on_map';
    const columnNames = [
      'idElement',
      'idEnvironment',
      'ValueAvg',
      'ValueMax',
      'Year',
      'Month',
      'day',
      'emissions_on_map.Measure',
      'elements.short_name',
      'environment.name',
      'gdk.mpc_avrg_d',
      'gdk.mpc_m_ot'
    ];
    const query = `
      SELECT
      ??
      FROM
      ??
      INNER JOIN
        elements
      ON
        elements.code = emissions_on_map.idElement
      INNER JOIN 
        environment
      ON
        environment.id = emissions_on_map.idEnvironment or environment.AttachEnv = emissions_on_map.idEnvironment
      LEFT JOIN 
        gdk
      ON
        gdk.code = emissions_on_map.idElement
      WHERE
        ?? = ?
      ${idEnvironmentClause}
      
      Order by emissions_on_map.Year desc, emissions_on_map.Month desc, emissions_on_map.day desc ${limit?'limit '+limit:''};`;
    const values = [
      columnNames,
      emissionsOnMapTable,
      filteringColumnName,
      id,
      'idEnvironment',
      idEnvironment,
    ];
    pool.query(query, values, (error, rows) => {
      if (error) {
        console.log(error);
        reject(error);
      }

      resolve(rows);
    });
  });
};

module.exports = {
  insertEmissionOnMap,
  SOURCE_POI,
  SOURCE_POLYGON,
  getEmissionsOnMap,
};
