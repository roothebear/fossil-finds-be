const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  getFindsByUsername,
  getCommentsByUsername,
  postUser,
  patchUserByUsername,
} = require("../controllers/users.controllers.js");

usersRouter.route("/").get(getUsers).post(postUser);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .patch(patchUserByUsername);

usersRouter
  .route("/:username/comments")
  .get(getCommentsByUsername)

  usersRouter.route("/:username/finds").get(getFindsByUsername);

module.exports = usersRouter;
