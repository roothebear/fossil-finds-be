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

exports.updateArticleById = (req) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return db
    .query(
      `UPDATE articles 
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
        console.log(result);
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "bad request - invalid sytnax used for inc_votes on body",
        });
      } else {
          console.log(result)
        return result.rows[0];
      }
    });
};

// DELETE MODELS
