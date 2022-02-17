const db = require("../db/connection.js");

exports.selectArticles = (
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  page = 1
) => {
  // deal with invalid queries
  const validSortBy = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Error - Invalid sort_by or order query",
    });
  }

  let queryStr = `SELECT 
  articles.article_id, 
  articles.title, 
  articles.topic, 
  articles.author, 
  articles.body, 
  articles.created_at, 
  articles.votes, 
  COUNT(comment_id )::INT AS comment_count 
  FROM articles 
  FULL JOIN comments 
  ON articles.article_id = comments.article_id`;

  // deal with topic
  if (topic) {
    // don't understand why quotations needed below, lucky troubleshooting!!
    queryStr += ` WHERE articles.topic = '${topic}'`;
  }

  // set article offset value by page number
  const offset = limit * (page - 1);

  const allArticlesQuery =
    queryStr + ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  const articlesByPageQuery =
    queryStr +
    ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order} LIMIT $1 OFFSET $2;`;

  // build final result object to respond with to controller
  const resultObject = {};

  return db
    .query("SELECT slug FROM topics;")
    .then((topics) => {
      return topics.rows.map((topic) => topic.slug);
    })
    .then((slugs) => {
      if (topic && !slugs.includes(topic)) {
        return Promise.reject({ status: 404, msg: "Topic not found" });
      } else {
        return topic;
      }
    })
    .then(() => {
      return db
        .query(articlesByPageQuery, [limit, offset])
        .then((response) => {
          resultObject.articles = response.rows;
          return response.rows;
        })
        .then(() => {
          return db
            .query(allArticlesQuery)
            .then((response) => {
              resultObject.totalCount = response.rows.length;
              return resultObject;
            });
        });
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

exports.selectCommentsByArticleId = (article_id, limit = 10, page = 1) => {

  const offset = limit * (page - 1)

  const resultObject = {}

  return db
    .query(
      `SELECT 
      comments.author, 
      comment_id, 
      comments.votes, 
      comments.body, 
      comments.created_at FROM comments
      JOIN articles ON comments.article_id = articles.article_id
            WHERE comments.article_id = $1
      LIMIT $2 OFFSET $3;`,
      [article_id, limit, offset]
    )
    .then((result) => {
      resultObject.comments = result.rows;
      return result.rows;
    })
    .then(() => {
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
          resultObject.commentCount = result.rows.length;
          return resultObject;
        });
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
      const newArticleId = result.rows[0]["article_id"];

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


// DELETE MODELS

exports.deleteArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE articles.article_id = $1;", [
      article_id,
    ])
    .then((article) => {
      if (article.rows.length === 0) {
        // if article does not exist return promise
        return Promise.reject({
          status: 404,
          msg: "no article with this id exists",
        });
      } else {
        return db
          .query(`DELETE FROM articles WHERE article_id = $1;`, [article_id])
          .then((result) => {
            return result;
          });
      }
    });
};