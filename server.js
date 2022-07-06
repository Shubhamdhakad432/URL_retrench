const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static("static"));
app.use("/models", express.static("models"));
app.use("/views", express.static("views"));
app.set("views", path.join(__dirname, "views")); // set view directory

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index.ejs", { shortUrls: shortUrls });
});

app.get("/views/index.ejs", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index.ejs", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.listen(port, () => {
  console.log(`this is started in successful run on ${port}`);
});
