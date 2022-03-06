const db = require("../db/connection.js");

exports.selectLocations = (req) => {
  return db.query(`SELECT * FROM locations;`).then((result) => result.rows);
};

exports.insertLocation = (settlement, county) => {
  return db
    .query(
      `INSERT INTO locations 
      (settlement, county) 
      VALUES ($1, $2)
      RETURNING *;`,
      [settlement, county]
    )
    .then((result) => {
      return result.rows[0];
      });
};
