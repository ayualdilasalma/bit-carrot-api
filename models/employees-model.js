const mongoose = require('mongoose');
const MODEL_NAME = 'Employees';

// define employee schema
const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

// TODO: define employee model
const Employee = mongoose.model(MODEL_NAME, employeeSchema);

// TODO: export the employee model
module.exports = Employee;


