const { selectTypes, insertType } = require("../models/types.models.js");

exports.getTypes = (req, res, next) => {
  selectTypes(req)
    .then((types) => {
      res.status(200).send({ types: types });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postType = (req, res, next) => {
  const { slug, description } = req.body;
  insertType(slug, description)
    .then((type) => {
      res.status(201).send({ type: type });
    })
    .catch((err) => {
      next(err);
    });
};
