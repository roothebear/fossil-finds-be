const apiRouter = require("express").Router();
const findsRouter = require("./finds.router.js");
const typesRouter = require("./types.router.js");
const locationsRouter = require("./locations.router.js");
const commentsRouter = require("./comments.router.js");
const usersRouter = require("./users.router.js");
const { getApiJson } = require("../controllers/api.controllers.js");

apiRouter.route("/").get(getApiJson);

apiRouter.use("/finds", findsRouter);

apiRouter.use("/types", typesRouter);

apiRouter.use("/locations", locationsRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
