const typesRouter = require("express").Router();
const {
  getTypes,
  postType,
} = require("../controllers/types.controllers.js");

typesRouter.route("/").get(getTypes).post(postType);

module.exports = typesRouter;
