const express = require("express");

const {
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers.js");

const apiRouter = require("./routes/api.router.js");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.status(200).send("all okay from /");
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});


app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;



