const mongoose = require('mongoose');

// Define the course list schema
const courseListSchema = new mongoose.Schema({
    coursename: { type: String, required: true, maxlength: 50 },
    userid: { type: String, required: true }, // Reference to User model
    courseid: { type: String, required: true } // Reference to Course model
});

// Create the course list model
const courselist = mongoose.models.courselist || mongoose.model('courselist', courseListSchema);

module.exports = courselist;
