const db = require("../db/connection.js");

// GET MODELS

exports.selectTopics = (req) => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};


// POST MODELS

// PATCH MODELS

// DELETE MODELS

