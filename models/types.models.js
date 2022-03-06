const db = require("../db/connection.js");

exports.selectTypes = (req) => {
  return db.query(`SELECT * FROM types;`).then((result) => result.rows);
};

exports.insertType = (slug, description) => {
  return db
    .query(
      `INSERT INTO types 
      (description, slug) 
      VALUES ($1, $2)
      RETURNING *;`,
      [description, slug]
    )
    .then((result) => {
      return result.rows[0];
      });
};
