const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
          return /^[a-zA-Z0-9\s]+$/.test(v)
      },
      message: `Title is not valid!`
  },
  minlength: [5, 'Title should be at least 5 characters long']
  },
  genre: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
          return /^[a-zA-Z0-9\s]+$/.test(v)
      },
      message: `Genre is not valid!`
  },
  minlength: [5, 'Genre should be at least 5 characters long']
  },
  director: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
          return /^[a-zA-Z0-9\s]+$/.test(v)
      },
      message: `Director is not valid!`
  },
  minlength: [5, 'Director should be at least 5 characters long']
  },
  year: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
          return v >= 1900 && v <= 2024
      },
      message: `Year should be between 1900 and 2024`
  },
  },
  rating: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
          return v >= 1 && v <= 5
      },
      message: `Rating should be between 1 and 5`
  },
  },
  description: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
          return /^[a-zA-Z0-9\s]+$/.test(v)
      },
      message: `Description is not valid!`
  },
  minlength: [20, 'Description should be at least 20 characters long']
  },
  imageUrl: {
    type: String,
    required: true,
    validate: function (value) {
      return /https?/.test(value);
    },
  },
  cast: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cast",
      },
    ],
    default: [],
  },
  creatorId: {
    type: String
  }
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
