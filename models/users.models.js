const db = require("../db/connection.js");

exports.selectUsers = (req) => {
  return db.query(`SELECT * FROM users;`).then((result) => result.rows);
};
