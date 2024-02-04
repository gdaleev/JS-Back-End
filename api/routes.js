const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");


const loadMovies = require("../loadMovies");
const loadCasts = require("../loadCasts");
const Movie = require("../models/Movie");
const Cast = require("../models/Cast");
const User = require("../models/User");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/create", (req, res) => {
  res.render("create");
});

router.get("/search", async (req, res) => {
  const movies = await loadMovies();

  res.render("search", { movies });
});

router.post("/search", async (req, res) => {
  try {
    const searchTitle = req.body.title;
    const searchGenre = req.body.genre;
    const searchYear = req.body.year;

    console.log("Search Conditions:", { searchTitle, searchGenre, searchYear });

    const regexTitle = new RegExp(searchTitle, "i");
    const regexGenre = new RegExp(searchGenre, "i");

    const conditions = [
      searchTitle ? { title: regexTitle } : null,
      searchGenre ? { genre: regexGenre } : null,
      searchYear ? { year: parseInt(searchYear, 10) } : null,
    ];

    const filteredConditions = conditions.filter(
      (condition) => condition !== null
    );

    console.log("Filtered Conditions:", filteredConditions);

    const searchResults = await Movie.find({
      $and: filteredConditions,
    });

    console.log("Search Results:", searchResults);

    res.render("searchResults", {
      results: searchResults,
      searchTitle,
      searchGenre,
      searchYear,
    });
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

    const casts = await Cast.find({ movie: movieId });

    const isAuthorized = movie.creatorId && movie.creatorId === req.user.userId;

    res.render("details", { movie, casts, isAuthorized });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching movie details");
  }
});

router.get("/create/cast", (req, res) => {
  res.render("cast-create");
});

router.post("/create/cast", async (req, res) => {
  const formData = req.body;

  const newCast = new Cast({
    name: formData.name,
    age: formData.age,
    born: formData.born,
    nameInMovie: formData.nameInMovie,
    castImage: formData.castImage,
  });

  try {
    const savedCast = await newCast.save();
    res.redirect("/");
  } catch {
    res.status(500).json({ error: "Failed to create new cast." });
  }
});

router.get("/attach/cast/:id", async (req, res) => {
  try {
    let movieId = req.params.id;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      res.status(404).send("Movie not found");
      return;
    }

    let casts = await loadCasts();
    casts = casts.filter(
      (castsToNotDisplay) => !movie.cast.includes(castsToNotDisplay._id)
    );

    res.render("cast-attach", { movie, casts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching movie details");
  }
});

router.post("/attach/cast/:id", async (req, res) => {
  const movieId = req.params.id;
  const castId = req.body.cast;

  try {
    const movie = await Movie.findById(movieId);
    const cast = await Cast.findById(castId);

    if (!movie.cast.includes(castId)) {
      movie.cast.push(castId);
      await movie.save();
    }

    if (!cast.movie.includes(movieId)) {
      cast.movie.push(movieId);
      await cast.save();
    }

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const formData = req.body;

  if (formData.password !== formData.rePassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const newUser = new User({
    email: formData.email,
    password: formData.password,
  });

  try {
    const savedUser = await newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPassValid = await user.comparePassword(password);

    if (!isPassValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payloads = { email, userId: user._id };
    const options = { expiresIn: "2d" };
    const secret = "MySuperPrivateSecret";
    const token = jwt.sign(payloads, secret, options);

    res.cookie("jwt", token, {
      httpOnly: false,
      sameSite: "None",
      secure: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

router.get("/edit/:id", async (req, res) => {
  try {
    let movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    res.render("edit", { movie });
  } catch (error) {
    console.error(error);
  }
});

router.post("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const formData = req.body;

    await Movie.findByIdAndUpdate(id, {
      title: formData.title,
      genre: formData.genre,
      director: formData.director,
      year: formData.year,
      imageUrl: formData.imageUrl,
      rating: formData.rating,
      description: formData.description,
    });

    res.redirect("/")
  } catch (error) {
    console.error(error);
  }
});

// Assuming you are using Express
router.post("/delete", async (req, res) => {
  try {
      const movieId = req.body.movieId;
      await Movie.findByIdAndDelete(movieId);
      res.redirect("/");
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});


router.use((req, res, next) => {
  res.status(404).render("404");
});

module.exports = router;
