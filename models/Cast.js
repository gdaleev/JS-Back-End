const mongoose = require('mongoose')

const castSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        max: 100,
        min: 14
    },
    born: {
        type: String, 
        required: true
    },
    nameInMovie: {
        type: String,
        required: true
    },
    castImage: {
        type: String,
        required: true,
        validate: function(value) {
            return /https?/.test(value)
        }
    },
    // TODO: movie – ObjectId, ref Movie Mode
})

const Cast = mongoose.model('Cast', castSchema)

module.exports = Cast;