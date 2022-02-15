const { selectTopics } = require("../models/topics.models.js");

exports.getTopics = (req, res, next) => {
  selectTopics(req)
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};
