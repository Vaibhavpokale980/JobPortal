const mongoose = require('mongoose');

// Define the job_list schema
const jobListSchema = new mongoose.Schema({
    userid: { type: String, required: true }, // Reference to Users model
    jobid: { type: String, required: true }, // Reference to Job model
    resume: { type: Buffer, required: true } // Store the resume as binary data
});

// Create the job_list model
const joblist = mongoose.models.joblist || mongoose.model('joblist', jobListSchema);

module.exports = joblist;
