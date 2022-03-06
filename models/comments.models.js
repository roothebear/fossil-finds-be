const db = require("../db/connection.js");

exports.deleteCommentById = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comments.comment_id = $1;", [
      comment_id,
    ])
    .then((comment) => {
      if (comment.rows.length === 0) {
        // if comment does not exist return promise
        return Promise.reject({
          status: 404,
          msg: "no comment with this id exists",
        });
      } else {
        return db
          .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
          .then((result) => {
            return result;
          });
      }
    });
};


exports.updateCommentById = (comment_id, inc_likes) => {
  return db
    .query(
      `UPDATE comments 
    SET likes = likes + $1
    WHERE comment_id = $2
    RETURNING *;`,
      [inc_likes, comment_id]
    )
    .then((result) => {
        return result.rows[0];
    });
};