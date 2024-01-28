const Cast = require("./models/Cast");

const loadMovies = async () => {
  try {
    const casts = await Cast.find();
    return casts;
  } catch (error) {
    console.error("Error loading movies:", error.message);
    return [];
  }
};

module.exports = loadCasts;