const {
  selectTopics,
  selectArticleById,
  selectUsers,
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

exports.getArticleById = (req, res, next) => {
  selectArticleById(req)
    .then((article) => {
      res.status(200).send({ article: article });
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
