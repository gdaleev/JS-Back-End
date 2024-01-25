const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const routes = require("./api/routes");
const fs = require("fs");
const bodyParser = require("body-parser");
const loadMovies = require("./loadMovies");
const Movie = require("./models/Movie");

function hbsConfig(port) {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // const configFolderPath = path.join(__dirname, "config");
  // const databasePath = path.join(configFolderPath, "database.json");

  // const moviesData = JSON.parse(fs.readFileSync(databasePath, "utf-8"));

  app.engine(
    "handlebars",
    exphbs.engine({
      extname: ".handlebars",
      defaultLayout: "main",
      layoutsDir: path.join(__dirname, "views", "layouts"),
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      },
    })
  );
  app.set("view engine", "handlebars");

  app.set("views", path.join(__dirname, "views"));
  app.use("/static", express.static(path.join(__dirname, "static")));

  app.get("/", async (req, res) => {
    const movies = await loadMovies();
    res.render("home", { movies });
  });

  app.post("/create", async (req, res) => {
    const formData = req.body;

    const newMovie = new Movie({
      title: formData.title,
      genre: formData.genre,
      director: formData.director,
      year: formData.year,
      imageUrl: formData.imageUrl,
      rating: formData.rating,
      description: formData.description,
    });

    try {
      const savedMovie = await newMovie.save();
      res.redirect("/");
    } catch {
      res.status(500).json({ error: "Failed to create a new movie." });
    }
  });

  app.use("/", routes);

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
}

module.exports = hbsConfig;
