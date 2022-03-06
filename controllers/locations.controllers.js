const { selectLocations, insertLocation } = require("../models/locations.models.js");

exports.getLocations = (req, res, next) => {
  selectLocations(req)
    .then((locations) => {
      res.status(200).send({ locations: locations });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postLocation = (req, res, next) => {
  const { settlement, county } = req.body;
  insertLocation(settlement, county)
    .then((location) => {
      res.status(201).send({ location: location });
    })
    .catch((err) => {
      next(err);
    });
};
