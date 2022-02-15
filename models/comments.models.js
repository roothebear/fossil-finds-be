const db = require("../db/connection.js");

exports.deleteCommentById = (req) => {
  const { comment_id } = req.params;
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((result) => {
      return result.rows[0];
    });
};
