const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

router.get("/", (req, res) => {
  res.render("main");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/create", (req, res) => {
  res.render("create");
});

router.get("/search", (req, res) => {
  const databasePath = path.join(__dirname, "..", "config", "database.json");

  const moviesData = JSON.parse(fs.readFileSync(databasePath, "utf-8"));

  res.render("search", { movies: moviesData });
});

router.post('/search', (req, res) => {
  const {title, genre, year } = req.body
  const databasePath = path.join(__dirname, "..", "config", "database.json");
  const movies = JSON.parse(fs.readFileSync(databasePath, "utf-8"));
  const searchResults = movies.filter(movie =>
    (!title || movie.title.toLowerCase().includes(title.toLowerCase())) &&
    (!genre || movie.genre.toLowerCase().includes(genre.toLowerCase())) &&
    (!year || movie.year === year)
  );

  // Render the search view with the search results
  res.render('search', { movies: searchResults, searchParams: { title, genre, year } });
})

router.get("/details/:id", (req, res) => {
  let movieId = req.params.id;
  movieId = movieId.replace(":", "");

  const databasePath = path.join(__dirname, "..", "config", "database.json");
  const moviesData = JSON.parse(fs.readFileSync(databasePath, "utf-8"));

  const movie = moviesData.find((movie) => movie.id == movieId);

  res.render("details", { movie });
});

router.use((req, res, next) => {
  res.status(404).render("404");
});

module.exports = router;
