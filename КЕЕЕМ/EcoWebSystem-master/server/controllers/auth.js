const pool = require('../../db-config/mysql-config');
const isEmpty = require("is-empty");

const login = (req, res) => {
  const { login, password } = req.body;

  const query = `
    SELECT
      user.user_name,
      user.id_of_expert,
      user.id_of_user,
      expert.expert_name,
      expert.expert_FIO
    FROM
      user
    INNER JOIN
      expert
    ON 
      user.id_of_expert = expert.id_of_expert
    WHERE user.user_name = '${login}' AND user.password = '${password}'
  ;`;

  return pool.query(query, [], (error, rows) => {
    if (error) {
      return res.status(500).send({
        message: error,
      });
    }

    if(!isEmpty(rows)){
      const response = {
        expert_name: rows[0].expert_name,
        id_of_expert: rows[0].id_of_expert,
        FIO: rows[0].expert_FIO,
        id_of_user: rows[0].id_of_user,
        user_name: rows[0].user_name,
      };

      return res.send(JSON.stringify(response));
    }
    else{
      return res.status(202).send();
    }
  });
};

module.exports = {
  login,
};
