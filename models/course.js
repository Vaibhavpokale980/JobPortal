const mongoose = require('mongoose');

// Define the course schema
const courseSchema = new mongoose.Schema({
    coursename: { type: String, required: true, maxlength: 50 },
    teacher: { type: String, required: true, maxlength: 50 },
    info: { type: String, required: true, maxlength: 50 },
    date: { type: String, required: true, maxlength: 50 },
    type: { type: String, required: true, maxlength: 50 },
    duration: { type: String, required: true, maxlength: 50 },
    img: { type: String, required: true }, // Store image URL or path
    url: { type: String, required: true, maxlength: 2048 },
    userid: { type: String, required: true } // Reference to Employee model
});

// Create the course model
const course = mongoose.models.course || mongoose.model('course', courseSchema);

module.exports = course;
