const articlesRouter = require("express").Router();

const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticleById,
  postArticle,
  postCommentByArticleId,
} = require("../controllers/articles.controllers.js");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
