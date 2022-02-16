const db = require("../db/connection.js");

exports.selectUsers = (req) => {
  return db.query(`SELECT * FROM users;`).then((result) => result.rows);
};


exports.selectUserByUsername = (username) => {
  return db
    .query(
      `SELECT username, name, avatar_url
      FROM users
      WHERE users.username = $1;`,
      [username]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no user with this username exists",
        });
      } else {
        return result.rows[0];
      }
    });
};