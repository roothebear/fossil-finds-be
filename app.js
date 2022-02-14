const express = require("express");
const {
  getTopics,
  getUsers,
  getArticles,
  getArticleById,
  patchArticleById,
} = require("./controllers/controllers.js");

const { handleCustomErrors, handlePsqlErrors } = require("./controllers/errors-controllers.js");

const app = express();
app.use(express.json());

// GET ENDPOINTS

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "all ok" });
});

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

// POST ENDPOINTS

// PATCH ENDPOINTS

app.patch("/api/articles/:article_id", patchArticleById);


// DELETE ENDPOINTS

// ERROR HANDLING ENDPOINTS

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);

module.exports = app;
