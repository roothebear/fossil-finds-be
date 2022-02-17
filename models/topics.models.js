const db = require("../db/connection.js");

exports.selectTopics = (req) => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};

exports.insertTopic = (slug, description) => {
  return db
    .query(
      `INSERT INTO topics 
      (description, slug) 
      VALUES ($1, $2)
      RETURNING *;`,
      [description, slug]
    )
    .then((result) => {
      return result.rows[0];
      });
};
