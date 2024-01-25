const Movie = require("./models/Movie");

const loadMovies = async () => {
  try {
    const movies = await Movie.find();
    return movies;
  } catch (error) {
    console.error("Error loading movies:", error.message);
    return [];
  }
};

module.exports = loadMovies;
