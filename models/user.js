const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, maxlength: 100 },
    contactnumber: { type: String, maxlength: 20 },
    password: { type: String, required: true, maxlength: 100 },
});

const user = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = user;