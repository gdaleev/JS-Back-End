const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const castSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
          return /^[a-zA-Z0-9\s]+$/.test(v)
      },
      message: `Name is not valid!`
  },
  minlength: [5, 'Name should be at least 5 characters long']
  },
  age: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
          return v >= 1 && v <= 120
      },
      message: `Age should be between 1 and 120`
  },
  },
  born: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
          return /^[a-zA-Z0-9\s]+$/.test(v)
      },
      message: `Born is not valid!`
  },
  minlength: [10, 'Born should be at least 10 characters long']
  },
  nameInMovie: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
          return /^[a-zA-Z0-9\s]+$/.test(v)
      },
      message: `Character is not valid!`
  },
  minlength: [5, 'Character should be at least 5 characters long']
  },
  castImage: {
    type: String,
    required: true,
    validate: function (value) {
      return /https?/.test(value);
    },
  },
  movie: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
    default: [],
  },
});

const Cast = mongoose.model("Cast", castSchema);

module.exports = Cast;
