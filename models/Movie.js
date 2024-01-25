const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    director: {
        type: String, 
        required: true
    },
    year: {
        type: Number,
        required: true,
        max: 2030,
        min: 1930
    },
    rating: {
        type: Number,
        required: true,
        max: 5,
        min: 1
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    imageUrl: {
        type: String,
        required: true,
        validate: function(value) {
            return /https?/.test(value)
        }
    }
    //TODO: cast – a collection of ObjectIds, ref Cast Mode
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie;