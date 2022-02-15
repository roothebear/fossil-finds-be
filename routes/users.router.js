const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/users.controllers.js");

usersRouter.route("/").get(getUsers);

module.exports = usersRouter;
