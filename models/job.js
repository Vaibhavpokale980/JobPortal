const mongoose = require('mongoose');

// Define the job schema
const jobSchema = new mongoose.Schema({
    jobtitle: { type: String, required: true, maxlength: 100 },
    company: { type: String, maxlength: 100 },
    vacancy: { type: String, required: true },
    image: { type: String, required: false }, // Using String to store image URL or path
    location: { type: String, maxlength: 50 },
    empid: { type: String, required: true },
    userid: { type: String, required: true },
    lastdate: { type: String, required: true },
});



// Create the job model
const job = mongoose.models.job || mongoose.model('job', jobSchema);

module.exports = job;
