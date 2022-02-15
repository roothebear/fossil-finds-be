const db = require("../db/connection.js");

// GET MODELS

exports.selectTopics = (req) => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};

exports.selectArticles = (req) => {
  return db.query(
      `SELECT * 
      FROM articles
      ORDER BY created_at DESC;`
  ).then((result) => result.rows);
};

exports.selectArticleById = (req) => {
  const { article_id } = req.params;
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id )::INT AS comment_count 
      FROM articles
      FULL JOIN comments ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
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

exports.selectCommentsByArticleId = (req) => {
  const { article_id } = req.params;
  return db
    .query(
      `SELECT comments.author, comment_id, comments.votes, comments.body, comments.created_at FROM comments
      JOIN articles ON comments.article_id = articles.article_id
            WHERE comments.article_id = $1;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no comments exist for this article",
        });
      } else {
        return result.rows;
      }
    });
};

exports.selectUsers = (req) => {
  return db.query(`SELECT * FROM users;`).then((result) => result.rows);
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
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "bad request - invalid sytnax used for inc_votes on body",
        });
      } else {
        return result.rows[0];
      }
    });
};

// DELETE MODELS
