const jsonKiev = require('./exmaple.json');
const jsonKievOblast = require('./dataKyivOblast25.11.2020.json');
const isEmpty = require('is-empty');
const pool = require('../../../db-config/mysql-config');
const { formatExcelDateToDateArr } = require('../formatDateForDatabase');

let DDMMYYYY; //1-день 2-месяц 3-год

(function name(pois) {
  let query;
  pool.query(
    `select idPoi, idElement, ValueAvg, year, month, day, Measure  from emissions_on_map where idPoi is not null`,
    async (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        for (const itr of jsonKievOblast.elements.element) {
          if (
            itr.id &&
            !isEmpty(itr.value) &&
            !isEmpty(itr.code) &&
            !isEmpty(itr.date) &&
            !isEmpty(itr.mesures)
          ) {
            itr.code.forEach((el, index) => {
              DDMMYYYY = formatExcelDateToDateArr(itr.date[0]);
              if (
                el != 0 &&
                rows.find(
                  (row) =>
                    row.idPoi == itr.id &&
                    row.ValueAvg == itr.value[index] &&
                    row.year == DDMMYYYY[2] &&
                    row.month == DDMMYYYY[1] &&
                    row.day == DDMMYYYY[0] &&
                    row.Measure == itr.mesures[index]
                ) == undefined
              ) {
                query = `
                  insert into emissions_on_map (idPoi, idElement,idEnvironment,ValueAvg,ValueMax,Year,Month,Day,Measure) 
                  values( "${
                    itr.id
                  }", "${el}",(select idEnvironment from poi where id=${
                  itr.id
                }) ,"${(+itr.value[index]).toFixed(2)}","${(+itr.value[
                  index
                ]).toFixed(2)}", "${DDMMYYYY[2]}","${DDMMYYYY[1]}","${
                  DDMMYYYY[0]
                }","${itr.mesures[index]}" )`;
                pool.query(query, (err, rows) => {
                  if (err) {
                    console.log(err);
                  }
                });
              } else {
                console.log('Duplicate');
              }
            });
          }
        }
      }
    }
  );
})();
