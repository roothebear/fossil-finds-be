const { selectTopics, insertTopic } = require("../models/topics.models.js");

exports.getTopics = (req, res, next) => {
  selectTopics(req)
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  insertTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic: topic });
    })
    .catch((err) => {
      next(err);
    });
};
