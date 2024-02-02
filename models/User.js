const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
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