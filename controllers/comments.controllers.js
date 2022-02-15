const {
  insertCommentByArticleId,
  deleteCommentById,
} = require("../models/comments.models.js");

exports.removeCommentById = (req, res, next) => {
  deleteCommentById(req)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
