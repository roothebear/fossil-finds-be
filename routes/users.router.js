const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  postUser
} = require("../controllers/users.controllers.js");

usersRouter.route("/").get(getUsers).post(postUser);

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
