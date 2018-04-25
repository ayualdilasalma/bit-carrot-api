'use strict';
const mongoose = require('mongoose');
const express = require('express');
var jwt = require('jsonwebtoken'); 
var app = express();
var bcrypt = require('bcrypt');
app.set('secret', 'iwebdevcarrot'); 

const User = require('../models/users-model');


class UsersRepository {
    constructor(mongodbUrl) {
        this.mongodbUrl = mongodbUrl;
    }

    /**
     * A helper method for creating User record on mongoDB
     * @param {*} request - Request body containing JSON object which represent a new User record to be saved
     */
    createUser(request) {
        return new Promise((resolve, reject) => {
            // Instantiate User Model by specified request body
            var userData = {
                email: request.email,
                username: request.username,
                password: request.password,
                passwordConf: request.passwordConf,
              }
            const newUser = new User(userData);
    
            // Validate the model instance and handle the validation error's response
            const errValidation = newUser.validateSync();
            if ( errValidation ) {
                console.log(`[ERROR] - <UsersRepository>.createUser details: \n`, errValidation);
                reject({
                    error: errValidation,
                    message: 'Unable to create a new Employee',
                    status: 400
                });
            }
    
            // Connect to MongoDB using mongoose
            mongoose.connect(this.mongodbUrl);
            const db = mongoose.connection;
    
            db.on(`error`, (err) => {
                console.log(`[ERROR] - <UsersRepository.createUser> details" \n`, err);
                return reject({
                    error: err,
                    message: 'Unable to connect to database',
                    status: 500,
                });
            });
    
            // Save the User instance into mongodb server
            newUser.save((err, createdUser) => {
                // Disconnect the database
                mongoose.disconnect();
    
                // Handle error's response
                if ( err ) {
                    console.log(`[ERROR] - <UsersRepository.createUser> details: \n`, err);
                    return reject({
                        error: err,
                        message: 'Unable to create a new User',
                        status: 403,
                    });
                } 
    
                console.log(`[INFO] - <UsersRepository.createUser> Returning created record`);
                resolve( createdUser );
            });
        });
    }

    /**
     * Get all users from database
     * @param {*} filter - optional parameter that can be used to filter the records. Default value is an empty object
     */
    getAll(filter = {}) {
        return new Promise((resolve, reject) => {
            // Connect to DB using mongoose
            mongoose.connect(this.mongodbUrl);
            const db = mongoose.connection;
    
            db.on(`error`, (err) => {
                console.log(`[ERROR] - <UsersRepository.getAll> details: \n`, err);
                reject({
                    error: err,
                    message: 'Unable to connect to database',
                    status: 500
                });
            });
    
            User.find(filter, (err, users) => {
                mongoose.disconnect();
    
                if ( err ) {
                    console.log(`[ERROR] - <UsersRepository.getAll> details: \n`, err);
                }
    
                console.log(`[SUCCESS] - <UsersRepository.getAll> details: \n`, users)
                resolve(users);
            });
        });
    }

    /**
     * Get token for validate a user
     * @param {*} request - Request body containing JSON object which represent a new User record to be validated
     */
    authenticate(request) {
        return new Promise((resolve, reject) => {
            mongoose.connect(this.mongodbUrl);
            const db = mongoose.connection;

            db.on(`error`, (err) => {
                console.log(`[ERROR] - <UsersRepository.authenticate> details: \n`, err);
                reject({
                    error: err,
                    message: 'Unable to connect to database',
                    status: 500
                });
            });

            // find the user
            User.findOne({ email: `${request.email}` }, (err, user) => {
                if (err) {
                    throw err;
                } else if (!user) {
                    reject({ 
                        success: false, 
                        message: 'Authentication failed. User not found.',
                        status: 401
                    });
                } else {
                    bcrypt.compare(request.password, user.password, function (err, result) {
                        if (result === true) {
                            const payload = {
                                username: user.username 
                            };
                            var token = jwt.sign(payload, app.get('secret'), {
                                expiresIn: 60 * 60 // expires in 24 hours
                            });
                    
                            // return the information including token as JSON
                            resolve({
                                success: true,
                                message: 'Enjoy your token!',
                                token: token
                            });
                        } else {
                            reject({ 
                               success: false, 
                               message: 'Authentication failed. Wrong password.',
                               status: 401
                            });
                        }
                    });
                }
            });
        });
    }

}

module.exports = UsersRepository;