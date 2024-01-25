const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const loadMovies = require('../loadMovies')
const Movie = require('../models/Movie')

router.get("/", (req, res) => {
  res.render("main");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/create", (req, res) => {
  res.render("create");
});

router.get("/search", async (req, res) => {
  const movies = await loadMovies()

  res.render("search", { movies });
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

  res.render('search', { movies: searchResults, searchParams: { title, genre, year } });
})

router.get("/details/:id", async (req, res) => {
  try {
    let movieId = req.params.id;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      res.status(404).send("Movie not found");
      return;
    }

    res.render("details", { movie });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching movie details");
  }
});

router.use((req, res, next) => {
  res.status(404).render("404");
});

module.exports = router;
