const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9]+@([a-zA-Z0-9]+\.){1,}[a-zA-Z0-9]+$/.test(v)
            },
            message: `Email is not valid!`
        },
        required: [true, 'Email is required'],
        minlength: [10, 'Email should be at least 10 characters long']
    },
    password: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9]+$/.test(v)
            },
            message: `Password is not valid!`
        },
        required: [true, 'Password is required'],
        minlength: [6, 'Password should be at least 6 characters long']
    }
})

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;

        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

const User = mongoose.model("User", userSchema)

module.exports = User;