const pool = require('../../db-config/mysql-config');

const { formatDateForDatabase } = require('../utils/formatDateForDatabase');

const getCompareInfo = (req, res) => {
  let {
    idEnvironment,
    PointsId,
    PolygonsId,
    startDate: startDateISOString,
    endDate: endDateISOString,
  } = req.query;

  let idClause = '';
  if (Array.isArray()) {
    idEnvironment.forEach((el,i)=>{
      idClause+= (i!=idEnvironment.length-1)?` emissions_on_map.idEnvironment=${idEnvironment} or `:` emissions_on_map.idEnvironment=${idEnvironment} `;
    })
  }
  else if(idEnvironment!='null'){
    idClause= `emissions_on_map.idEnvironment=${idEnvironment}`
  }

  const { stateDate, endDate } = {
    stateDate: formatDateForDatabase(startDateISOString),
    endDate: formatDateForDatabase(endDateISOString),
  };
  queryForFilteringByDates = `HAVING Formatted_Date >= '${stateDate}' and Formatted_Date <= '${endDate}'`;

  if (PointsId) {
    for (let i = 0; i < PointsId.length; i++) {
      PointsId[i] = `IdPoi=${PointsId[i]}`;
    }
  }

  if (PolygonsId) {
    for (let i = 0; i < PolygonsId.length; i++) {
      PolygonsId[i] = `IdPoligon=${PolygonsId[i]}`;
    }
  }
  let query = `
    SELECT 
      ValueAvg,
      ValueMax,
      CONCAT(Year,"-",Month,"-",Day) as "DateEm",
      case
        when emissions_on_map.idPoi is null then poligon.name
        when emissions_on_map.idPoligon is null then poi.Name_Object 
      end as Name_Object,
      elements.Name as ElementName,
      emissions_on_map.Measure,
      STR_TO_DATE(CONCAT(Year,'-',LPAD(Month,2,'00'),'-',LPAD(day,2,'00')), '%Y-%m-%d') as Formatted_Date
    FROM emissions_on_map
      left join poi on poi.id=emissions_on_map.idpoi
      left join poligon on poligon.id_of_poligon=emissions_on_map.idPoligon
      left join elements on elements.code=emissions_on_map.idelement
      where (${
        PointsId != undefined ? PointsId.join(' or ') : ' '
      } 
      ${
        PointsId != undefined && PolygonsId != undefined
          ? ' or '
          : ' '
      } 
        ${
          PolygonsId != undefined ? PolygonsId.join(' or ') : ' '
        })  
      ${idClause? 'AND ' + idClause: ''}
      ${
        startDateISOString || endDateISOString
          ? queryForFilteringByDates
          : ''
      }`;

  return pool.query(query, (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: err,
      });
    }

    const resp = rows.map(
      ({ ValueAvg, ValueMax, DateEm, Name_Object, Measure, ElementName }) => {
        return {
          ValueAvg,
          ValueMax,
          DateEm,
          Name_Object,
          Measure,
          ElementName,
          visible: true,
        };
      }
    );
    return res.send(resp);
  });
};

module.exports = {
  getCompareInfo,
};
