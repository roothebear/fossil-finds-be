const db = require("../db/connection.js");

exports.selectArticles = (req) => {
  // destructure optional query parameters, we will deal with each in turn
  const { sort_by, order, topic } = req.query;

  // set up array for query values used
  const queryValues = [];
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id )::INT AS comment_count 
  FROM articles 
  FULL JOIN comments ON articles.article_id = comments.article_id`;

  // deal with topic
  if (!(typeof topic === "undefined")) {
    queryValues.push(topic);
    queryStr += ` WHERE topic = $1`;
  }

  // deal with grouping
  queryStr += ` GROUP BY articles.article_id`;

  // deal with sort_by (alpha-numeric column to sort by)
  if (!(typeof sort_by === "undefined")) {
    if (
      !["title", "topic", "author", "body", "created_at", "votes"].includes(
        sort_by
      )
    ) {
      return Promise.reject({
        status: 400,
        msg: "Error - Invalid sort_by query",
      });
    }
    queryStr += ` ORDER BY ${sort_by}`;
  } else {
    queryStr += ` ORDER BY created_at`;
  }

  // deal with order
  if (!(typeof order === "undefined")) {
    if (!["asc", "desc"].includes(order)) {
      return Promise.reject({
        status: 400,
        msg: "Error - Invalid order query",
      });
    }
    queryStr += ` ${order}`;
  } else {
    queryStr += ` DESC`;
  }

  // add final ';'!
  queryStr += `;`;

  return db.query(queryStr, queryValues).then((result) => {
    if (result.rows.length === 0) {
      // as we have an empty array of articles in this case, check database for existence of the topic with further query
      return db
        .query("SELECT * FROM topics WHERE topics.slug = $1;", [topic])
        .then((topics) => {
          if (topics.rows.length === 0) {
            // if topic does not exist return promise
            return Promise.reject({ status: 404, msg: "Topic not found" });
          } else {
            return result.rows;
          }
        });
    }
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, 
      articles.title, 
      articles.topic, 
      articles.author, 
      articles.body, 
      articles.created_at, 
      articles.votes, 
      COUNT(comment_id )::INT AS comment_count 
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

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT 
      comments.author, 
      comment_id, 
      comments.votes, 
      comments.body, 
      comments.created_at FROM comments
      JOIN articles ON comments.article_id = articles.article_id
            WHERE comments.article_id = $1;`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

// POST MODELS

exports.insertCommentByArticleId = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments 
      (author, body, article_id) 
      VALUES ( $1, $2, $3 )
      RETURNING *;`,
      [username, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.insertArticle = (author, title, body, topic) => {
  return db
    .query(
      `INSERT INTO articles 
      (author, title, body, topic ) 
      VALUES ( $1, $2, $3, $4)
      RETURNING *;`,
      [author, title, body, topic] 
    )
    .then((result) => {
      // take article_id from article returned
      const newArticleId = result.rows[0]["article_id"]
      console.log(result)

      // return article with comment count
      return exports.selectArticleById(newArticleId);
    });
};

// PATCH MODELS

exports.updateArticleById = (article_id, inc_votes) => {
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
