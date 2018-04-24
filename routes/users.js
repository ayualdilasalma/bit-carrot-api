var express = require('express');
var router = express.Router();
var User = require('../models/users-model');
var jwt = require('jsonwebtoken'); 
var app = express();
var bcrypt = require('bcrypt');

app.set('secret', 'iwebdevcarrot'); 

const mongoose = require('mongoose');


const MONGODB_URL = 'mongodb+srv://dila:Helloworld123@cluster0-82r3u.mongodb.net/bit-carrot';


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async (req, res, next) => {
    // res.send(JSON.stringify(req.body));
  return new Promise((resolve, reject) => {
        console.log(JSON.stringify(req.body));
        // Instantiate Employee Model by specified request body
        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
          }
        const newEmployee = new User(userData);

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
        mongoose.connect(MONGODB_URL);
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

router.get('/get', async(req, res, next) => {
    return new Promise((resolve, reject) => {
        // Connect to DB using mongoose
        mongoose.connect(MONGODB_URL);
        const db = mongoose.connection;

        db.on(`error`, (err) => {
            console.log(`[ERROR] - <EmployeesRepository.getAll> details: \n`, err);
            reject({
                error: err,
                message: 'Unable to connect to database',
                status: 500
            });
        });

        User.find({}, (err, employees) => {
            mongoose.disconnect();

            if ( err ) {
                console.log(`[ERROR] - <EmployeesRepository.getAll> details: \n`, err);
            }

            console.log(`[SUCCESS] - <EmployeesRepository.getAll> details: \n`, employees)
            return resolve(employees);
        });
    });
  });

  router.post('/authenticate', function(req, res) {
    mongoose.connect(MONGODB_URL);
        const db = mongoose.connection;

        db.on(`error`, (err) => {
            console.log(`[ERROR] - <EmployeesRepository.getAll> details: \n`, err);
            reject({
                error: err,
                message: 'Unable to connect to database',
                status: 500
            });
        });

        // find the user
        User.findOne({ email: req.body.email })
            .exec(function (err, user) {
            if (err) {
                throw err;
            } else if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            }
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result === true) {
                    const payload = {
                        username: user.username 
                    };
                    var token = jwt.sign(payload, app.get('secret'), {
                        expiresIn: 60 * 60 // expires in 24 hours
                    });
            
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                } else {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                }
            })
        });
  });

module.exports = router;
