// express.js

const express = require("express");

const PORT = 8080;
const app = express();

app.set("view engine", "ejs"); 

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  res.render("search_results");
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});