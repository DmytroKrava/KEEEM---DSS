const pool = require('../../db-config/mysql-config');
const { removeDuplicates } = require('../utils/duplicateRemover');
const { groupBy } = require('lodash');

const getParams = async (req, res) => {
  //return string
  async function getFormulaNode(id_of_formula) {
    let select = `select Concat(name_of_formula, ' (', measurement_of_formula, ')') as node
    		from formulas
			where id_of_formula = ${id_of_formula};`;
    return new Promise((resolve, reject) =>
      pool.query(select, (err, rows) => {
        if (err) {
          reject(err);
        }

        return resolve(rows[0].node);
      })
    );
  }

  //return [] of values
  function getParamAvailableValues(id_of_param) {
    const select = `select distinct (value)
      from med_stat_param
      where id_of_param = ${id_of_param};`;
    return new Promise((resolve, reject) =>
      pool.query(select, (err, rows) => {
        if (err) {
          reject(err);
        }

        return resolve(rows);
      })
    );
  }

  let indexOfElem = 0;

  function getFormulaNameElement(name) {
    indexOfElem++;
    return {
      id: indexOfElem,
      name: name,
      isExpanded: false,
      children: [],
    };
  }

  function getMedStatValueElement(name) {
    indexOfElem++;
    return {
      id: indexOfElem,
      name: name,
      isExpanded: false,
    };
  }

  const generalMordibityExpander = getFormulaNameElement(
    await getFormulaNode(224)
  );
  const diseaseExpander = getFormulaNameElement(await getFormulaNode(225));
  const ageExpander = getFormulaNameElement(await getFormulaNode(226));
  const genderExpander = getFormulaNameElement(await getFormulaNode(230));

  generalMordibityExpander.children.push(diseaseExpander);
  generalMordibityExpander.children.push(ageExpander);
  generalMordibityExpander.children.push(genderExpander);

  for (const value of (await getParamAvailableValues(225)).map(
    (elem) => elem.value
  )) {
    diseaseExpander.children.push(getMedStatValueElement(value));
  }
  for (const value of (await getParamAvailableValues(226)).map(
    (elem) => elem.value
  )) {
    ageExpander.children.push(getMedStatValueElement(value));
  }
  for (const value of (await getParamAvailableValues(230)).map(
    (elem) => elem.value
  )) {
    genderExpander.children.push(getMedStatValueElement(value));
  }

  let response = [generalMordibityExpander];
  res.send(response);
};

const getMedStat = (req, res) => {
  let { regionId } = req.query;
  const getValues = `select region.name, med_stat.year, med_stat_param.number_of_formula,
  region.id_of_poligon, med_stat_param.value as indicator,
  med_stat.value
  from med_stat
  join med_stat_param on med_stat_param.number_of_formula=med_stat.nomer
  join region on region.id_of_poligon=med_stat.region_id
  where region.id_of_poligon=${regionId} and
  med_stat_param.value = 'C00-C97'
  limit 20;`;

  const getAges = `select distinct med_stat_param.value from med_stat_param where med_stat_param.id_of_param = 226;`;

  const getValuesPromise = new Promise((resolve, reject) => {
    pool.query(getValues, (err, rows) => {
      if (err) {
        reject(err);
      }
      return resolve(rows);
    });
  });

  const getAgesPromise = new Promise((resolve, reject) => {
    pool.query(getAges, (err, rows) => {
      if (err) {
        reject(err);
      }

      return resolve(rows);
    });
  });

  const resultPromise = Promise.all([getValuesPromise, getAgesPromise]).then(
    ([Values, Ages]) => {
      Values.forEach((value, index) => (value.age = Ages[index].value));
      return [...Values];
    }
  );
  return resultPromise.then((result) => {
    res.send(result);
  });
};

const getMedStatByParams = async (req, res) => {
  let { regionId, checkboxes } = req.body;
  const response = await getMedStatByParamsQuery(
    regionId,
    JSON.parse(checkboxes)
  );
  res.send(response);
};

const getMedStatValues = (req, res) => {
  let { id } = req.query;
  pool.query(
    `select nomer, number_of_formula, name_of_formula, value, measurement_of_formula
      from med_stat_param
               left join formulas f on med_stat_param.id_of_param = f.id_of_formula
      where med_stat_param.number_of_formula = ${id};`,
    (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.send(rows);
      }
    }
  );
};

async function getMedStatByParamsQuery(regionId, checkboxes, years = [2019]) {
  const getCheckedValues = (array) =>
    !!array
      ? array.filter((item) => item.isChecked).map((item) => item.name)
      : [];

  let select = `select issues.name,
                        formulas.name_of_formula,
                        med_stat.year,
                    /*formulas.description_of_formula,*/
                        formulas.measurement_of_formula,
                        med_stat.value,
                        med_stat.nomer,
                   /* med_stat_param.value as parametr,*/
                        med_stat_param.nomer as param_nomer
                    from med_stat
                        left join med_stat_param on med_stat.nomer = med_stat_param.number_of_formula
                        left join formulas on med_stat.id_of_formula = formulas.id_of_formula
                        left join issues on med_stat.issue_id = issues.issue_id
                    where med_stat.nomer in (select distinct med_stat.nomer
                                        from med_stat
                                                left join med_stat_param on med_stat.nomer = med_stat_param.number_of_formula
                                        where med_stat.region_id = ${regionId}
                                        and med_stat.year in (${years
                                          .map((value) => "'" + value + "'")
                                          .join(', ')})`;

  const diseaseChekedValues = getCheckedValues(
    checkboxes[0].children[0].children
  );
  const ageChekedValues = getCheckedValues(checkboxes[0].children[1].children);
  const genderChekedValues = getCheckedValues(
    checkboxes[0].children[2].children
  );
  let medStatParamValues = [];
  let countOfParams = 0;
  if (
    diseaseChekedValues.length > 0 ||
    ageChekedValues.length > 0 ||
    genderChekedValues.length > 0
  ) {
    if (diseaseChekedValues.length > 0) {
      countOfParams++;
      medStatParamValues = medStatParamValues.concat(diseaseChekedValues);
    }
    if (ageChekedValues.length > 0) {
      countOfParams++;
      medStatParamValues = medStatParamValues.concat(ageChekedValues);
    }
    if (genderChekedValues.length > 0) {
      countOfParams++;
      medStatParamValues = medStatParamValues.concat(genderChekedValues);
    }
    select += `and med_stat_param.value in (${medStatParamValues
      .map((value) => "'" + value + "'")
      .join(', ')})`;
  }
  select += `group by med_stat.nomer
    		having count( * ) = ${countOfParams});`;

  return new Promise((resolve, reject) =>
    pool.query(select, (err, rows) => {
      if (err) {
        reject(err);
      }

      return resolve(
        groupBy(rows, function (row) {
          return row.nomer;
        })
      );
    })
  );
}

module.exports = {
  getMedStat,
  getParams,
  getMedStatByParams,
  getMedStatValues,
};
