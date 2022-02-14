const { selectTopics } = require("../models/models.js");

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


// POST CONTROLLERS

// PATCH CONTROLLERS

// DELETE CONTROLLERS
