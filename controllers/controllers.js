const {
  selectTopics,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  selectUsers,
  insertCommentByArticleId,
  updateArticleById,
} = require("../models/models.js");


// GET CONTROLLERS

exports.getTopics = (req, res, next) => {
  selectTopics(req)
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

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

exports.getUsers = (req, res, next) => {
  selectUsers(req)
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

// POST CONTROLLERS

exports.postCommentByArticleId = (req, res, next) => {
  insertCommentByArticleId(req)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      console.log(err)
      next(err);
    });
};

// PATCH CONTROLLERS

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

// DELETE CONTROLLERS
