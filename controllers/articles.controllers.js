const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  updateArticleById,
  insertArticle,
  insertCommentByArticleId,
  deleteArticleById,
} = require("../models/articles.models.js");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, page } = req.query;
  selectArticles(sort_by, order, topic, limit, page)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, page } = req.query;
  selectCommentsByArticleId(article_id, limit, page)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic } = req.body;
  insertArticle(author, title, body, topic)
    .then((article) => {
      res.status(201).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeArticleById = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticleById(article_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err)
      next(err);
    });
};