const locationsRouter = require("express").Router();
const {
  getLocations,
  postLocation,
} = require("../controllers/locations.controllers.js");

locationsRouter.route("/").get(getLocations).post(postLocation);

module.exports = locationsRouter;
