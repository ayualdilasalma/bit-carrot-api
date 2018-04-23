var express = require('express');
var router = express.Router();
var User = require('../models/users-model');
const mongoose = require('mongoose');


const MONGODB_URL = 'mongodb+srv://dila:Helloworld123@cluster0-82r3u.mongodb.net/bit-carrot';


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async(req, res, next) => {
  return new Promise((resolve, reject) => {
    console.log(JSON.stringify(req.body));
    // Instantiate Employee Model by specified request body
    const newEmployee = new User(req);

    // Validate the model instance and handle the validation error's response
    const errValidation = newEmployee.validateSync();
    if ( errValidation ) {
        console.log(`[ERROR] - <EmployeesRepository>.createEmployee details: \n`, errValidation);
        return reject({
            error: errValidation,
            message: 'Unable to create a new Employee',
            status: 400
        });
    }

    // Connect to MongoDB using mongoose
    mongoose.connect(this.mongodbUrl);
    const db = mongoose.connection;

    db.on(`error`, (err) => {
        console.log(`[ERROR] - <EmployeesRepository.createEmployee> details" \n`, err);
        return reject({
            error: err,
            message: 'Unable to connect to database',
            status: 500,
        });
    });

    // Save the Employee instance into mongodb server
    newEmployee.save((err, createdEmp) => {
        // Disconnect the database
        mongoose.disconnect();

        // Handle error's response
        if ( err ) {
            console.log(`[ERROR] - <EmployeesRepository.createEmployee> details: \n`, err);
            return reject({
                error: err,
                message: 'Unable to create a new Employee',
                status: 400,
            });
        } 

        console.log(`[INFO] - <EmployeesRepository.createEmployee> Returning created record`);
        resolve( createdEmp );
    });
});
});

module.exports = router;
