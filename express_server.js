// express.js

const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const { recommendedBySpotify } = require("./helpers");

const PORT = 8080;
const app = express();

app.engine ('.html', ejs.renderFile);
app.set ('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/json", async (req, res) => {
  const a = await recommendedBySpotify("spoder");
  res.send(a);
});

app.post("/search_results", async (req, res) => {
  const artistName = req.body.search;

  if (artistName) {
    const html = await ejs.renderFile("./views/search_results.ejs", { recommendedBySpotify, artistName }, { async: true });
    res.send(html);
  } else {
    res.redirect("/")
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});