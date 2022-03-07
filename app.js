const express = require("express");
const cors = require("cors");

const {
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers.js");

const apiRouter = require("./routes/api.router.js");
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.status(200).send("welcome, all is ok!");
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;
