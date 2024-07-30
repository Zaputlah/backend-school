const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    name: String,
    age: Number,
    previousSchool: String,
    grade: String,
    registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('register', registerSchema);
