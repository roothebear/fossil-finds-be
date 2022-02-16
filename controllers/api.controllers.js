const { readEndpoints } = require("../models/api.models.js");

exports.getApiJson = (req, res, next) => {
  readEndpoints()
    .then((endpoints) => {
      return res.status(200).send( endpoints );
    })
    .catch((err) => {
      next(err);
    });
};
