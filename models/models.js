const db = require("../db/connection.js");

// GET MODELS

exports.selectTopics = (req) => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};


exports.selectArticleById = (req) => {
  const { article_id } = req.params;
  return db
    .query(
      `SELECT * FROM articles
            WHERE articles.article_id = $1;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no article with this id exists",
        });
      } else {
        return result.rows[0];
      }
    });
};



// POST MODELS

// PATCH MODELS

// DELETE MODELS

