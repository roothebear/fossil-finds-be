const apiRouter = require("express").Router();
const articlesRouter = require("./articles.router.js");
const topicsRouter = require("./topics.router.js");
const commentsRouter = require("./comments.router.js");
const usersRouter = require("./users.router.js");
const { getApiJson } = require("../controllers/api.controllers.js");

apiRouter.route("/").get(getApiJson);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
