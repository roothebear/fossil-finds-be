const db = require("../db/connection.js");

exports.selectUsers = (req) => {
  return db.query(`SELECT * FROM users;`).then((result) => result.rows);
};

exports.selectUserByUsername = (username) => {
  return db
    .query(
      `SELECT username, name, avatar_url, bio
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

exports.insertUser = (username, name, avatar_url, bio) => {
  return db
    .query(
      `INSERT INTO users 
      (username, name, avatar_url, bio ) 
      VALUES ( $1, $2, $3, $4 )
      RETURNING *;`,
      [username, name, avatar_url, bio]
    )
    .then((result) => {
      // take user_id from user returned
      return result.rows[0];
    });
};

// PATCH MODELS

exports.updateUserByUsername = (username, name, avatar_url, bio) => {
  return db
    .query(
      `UPDATE users 
    SET 
    name = COALESCE ($1, name),
    avatar_url = COALESCE ($2, avatar_url),
    bio = COALESCE ($3, bio),
    WHERE username = $4
    RETURNING *;`,
      [name, avatar_url, bio, username]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "bad request - invalid sytnax used",
        });
      } else {
        return result.rows[0];
      }
    });
};

// DELETE MODELS - CAREFUL, THIS WOULD NEED TO CASCADE

// exports.deleteUserByUsername = (username) => {
//   return db
//     .query("SELECT * FROM users WHERE users.username = $1;", [username])
//     .then((user) => {
//       if (user.rows.length === 0) {
//         // if user does not exist return promise
//         return Promise.reject({
//           status: 404,
//           msg: "no user with this id exists",
//         });
//       } else {
//         return db
//           .query(`DELETE FROM users WHERE username = $1;`, [username])
//           .then((result) => {
//             return result;
//           });
//       }
//     });
// };
