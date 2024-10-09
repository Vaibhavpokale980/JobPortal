const mongoose = require('mongoose');

// Define the employee schema
const employeeSchema = new mongoose.Schema({
    username: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, maxlength: 100 },
    password: { type: String, required: true, maxlength: 100 },
    contactnumber: { type: String, maxlength: 20 },
});

// Create the employee model
const employee = mongoose.models.employee || mongoose.model('employee', employeeSchema);

module.exports = employee;