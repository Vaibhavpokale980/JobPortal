const mongoose = require('mongoose');

// Define the admin login schema
const adminLoginSchema = new mongoose.Schema({
    id: { type: String, required: true } // Reference to User model
});

// Create the admin login model
const adminLogin = mongoose.models.adminlogin || mongoose.model('adminlogin', adminLoginSchema);

module.exports = adminLogin;
