const express = require("express");
const {
  getTopics,
  getUsers,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticleById,
  postCommentByArticleId,
  removeCommentById,
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

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

// POST ENDPOINTS

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

// PATCH ENDPOINTS

app.patch("/api/articles/:article_id", patchArticleById);


// DELETE ENDPOINTS

app.delete("/api/comments/:comment_id", removeCommentById);

// ERROR HANDLING ENDPOINTS

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);

module.exports = app;
