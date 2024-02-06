const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const routes = require("./api/routes");
const bodyParser = require("body-parser");
const loadMovies = require("./loadMovies");
const Movie = require("./models/Movie");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const jwt = require("jsonwebtoken");

function hbsConfig(port) {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

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

  app.use("/", (req, res, next) => {
    const isAuthenticated = !!req.cookies.jwt;
    res.locals.isAuthenticated = isAuthenticated;
    next();
  });

  app.get("/", async (req, res) => {
    const movies = await loadMovies();
    res.render("home", { movies });
  });

  // Middleware to verify JWT token
  const verifyToken = async (req, res, next) => {
    try {
      const publicRoutes = ["/", "/about", "/search", "login", "/register"];

      const token = req.cookies.jwt || req.headers.authorization;

      if (!token || publicRoutes.includes(req.path)) {
        return next();
      }

      const decoded = await jwt.verify(token, "MySuperPrivateSecret");

      req.user = decoded;

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  };

  app.use(verifyToken);

  app.post("/create", async (req, res) => {
    try {
      const formData = req.body;

      const newMovie = new Movie({
        title: formData.title,
        genre: formData.genre,
        director: formData.director,
        year: formData.year,
        imageUrl: formData.imageUrl,
        rating: formData.rating,
        description: formData.description,
        creatorId: req.user.userId,
      });

      const savedMovie = await newMovie.save();
      res.redirect("/");
    } catch (error) {
      if (error.name === "ValidationError") {
        // Mongoose validation error
        const mongooseErrors = Object.values(error.errors).map((err) => err.message);
        return res.render("create", {mongooseErrors, layout: 'main'})
      }

      return res.status(500).json({ error: "Failed to create a new movie." });
    }
  });

  app.use("/", routes);

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
}

module.exports = hbsConfig;
