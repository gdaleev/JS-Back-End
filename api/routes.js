const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const loadMovies = require('../loadMovies')
const Movie = require('../models/Movie')
const Cast = require('../models/Cast')
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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

router.post("/search", async (req, res) => {
  try {
    const searchTitle = req.body.title; // Assuming the search term is provided in the query parameter 'q'
    const searchGenre = req.body.genre; // Assuming the year is provided in the query parameter 'year'
    const searchYear = req.body.year; // Assuming the year is provided in the query parameter 'year'

    // Use a regular expression to make the search case-insensitive and partial
    const regex = new RegExp(searchTerm, 'i');

    // Construct the conditions array for the $or operator
    const conditions = [
      searchTitle ? { title: regex } : null,
      searchGenre ? { genre: regex } : null,
      // Add additional fields as needed

      // Example: search by releaseYear if provided
      searchYear ? { releaseYear: parseInt(searchYear, 10) } : null,
    ];

    // Filter out null values from the conditions array
    const filteredConditions = conditions.filter(condition => condition !== null);

    // Perform the search using the $or operator and additional conditions
    const searchResults = await Movie.find({
      $or: filteredConditions,
    });

    res.render("searchResults", { results: searchResults, searchTitle, searchGenre, searchYear });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error performing search");
  }
});


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

router.get("/create/cast", (req, res) => {
  res.render("cast-create")
})

router.post("/create/cast", async (req, res) => {
  const formData = req.body;
  console.log("Form data:", formData);
  const newCast = new Cast({
    name: formData.name,
    age: formData.age,
    born: formData.born,
    nameInMovie: formData.nameInMovie,
    castImage: formData.castImage,
  })
  console.log("New Cast instance:", newCast);
  try {
    const savedCast = await newCast.save();
    res.redirect("/");
  } catch {
    res.status(500).json({ error: "Failed to create new cast." });
  }
})

router.get("/attach/cast/:id", async (req, res) => {
  try {
    let movieId = req.params.id;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      res.status(404).send("Movie not found");
      return;
    }

    res.render("cast-attach", { movie });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching movie details");
  }
  
})

router.use((req, res, next) => {
  res.status(404).render("404");
});

module.exports = router;
