// express.js

const bodyParser = require("body-parser");
const express = require("express");

const PORT = 8080;
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  res.redirect("/search_results");
});

app.get("/search_results", (req, res) => {
  const artistName = req.params.search;
  res.render("search_results", {artistName});
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});