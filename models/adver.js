const mongoose = require('mongoose');

// Define the adver schema
const adverSchema = new mongoose.Schema({
    jobid: { type: String, required: true }, // Reference to Job model
    experi: { type: String, maxlength: 2048 },
    descri: { type: String, maxlength: 2048 },
    salary: { type: String, maxlength: 50 },
    additional: { type: String } // Using String for additional text, change to Buffer if necessary
});

// Create the adver model
const adver = mongoose.models.adver || mongoose.model('adver', adverSchema);

module.exports = adver;