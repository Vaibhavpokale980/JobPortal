const mongoose = require('mongoose');

// Define the login schema
const loginSchema = new mongoose.Schema({
    id: { type: String, required: true } // Reference to User model
});

// Create the login model
const login = mongoose.models.login || mongoose.model('login', loginSchema);

module.exports = login;