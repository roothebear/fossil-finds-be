const express = require("express");
const { getTopics } = require("./controllers/controllers.js");

const app = express();
app.use(express.json());

// GET ENDPOINTS

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "all ok" });
});

app.get("/api/topics", getTopics);


// POST ENDPOINTS

// PATCH ENDPOINTS

// DELETE ENDPOINTS

// ERROR HANDLING ENDPOINTS

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
