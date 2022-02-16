const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  updateArticleById,
  insertCommentByArticleId,
} = require("../models/articles.models.js");

exports.getArticles = (req, res, next) => {
  selectArticles(req)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  selectArticleById(req)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  selectCommentsByArticleId(req)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  updateArticleById(req)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  insertCommentByArticleId(req)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};