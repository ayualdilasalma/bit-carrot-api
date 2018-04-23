'use strict';

const Employee = require('../models/employees-model');
const mongoose = require('mongoose');

class EmployeesRepository {
    constructor(mongodbUrl) {
        this.mongodbUrl = mongodbUrl;
    }

    /**
     * A helper method for creating Employee record on mongoDB
     * @param {*} request - Request body containing JSON object which represent a new Employee record to be saved
     */
    createEmployee(request) {
        return new Promise((resolve, reject) => {
            // Instantiate Employee Model by specified request body
            const newEmployee = new Employee(request);

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
    }

    /**
     * Get all employees from database
     * @param {*} filter - optional parameter that can be used to filter the records. Default value is an empty object
     */
    getAll(filter = {}) {
        return new Promise((resolve, reject) => {
            // Connect to DB using mongoose
            mongoose.connect(this.mongodbUrl);
            const db = mongoose.connection;

            db.on(`error`, (err) => {
                console.log(`[ERROR] - <EmployeesRepository.getAll> details: \n`, err);
                reject({
                    error: err,
                    message: 'Unable to connect to database',
                    status: 500
                });
            });

            Employee.find(filter, (err, employees) => {
                mongoose.disconnect();

                if ( err ) {
                    console.log(`[ERROR] - <EmployeesRepository.getAll> details: \n`, err);
                }

                resolve(employees);
            });
        });
    }

    /**
     * Get Employee By spesific id
     * @param {String} id ID of record to retrieve
     */
    get(id) {
        return new Promise((resolve, reject) => {
            mongoose.connect(this.mongodbUrl);
            const db = mongoose.connection;

            db.on(`error`, (err) => {
                console.log(`[ERROR] - <EmployeesRepository.get> details: \n`, err);
                reject({
                    error: err,
                    message: 'Unable to connect to database',
                    status: 500,
                });
            });

            Employee.findById(id, (err, employee) => {
                mongoose.disconnect();

                if ( err ) {
                    console.log(`[ERROR] - <EmployeesRepository.get> details: \n`, err);
                    return reject({
                        error: err,
                        message: 'Unable to get an employee by id',
                    });
                }

                resolve(employee);
            });
        });
    }

    /**
     * Update Employee record by ID
     * @param {String} id - the ID of target record to update
     * @param {*} changedData - changed record
     */
    update(id, changedData) {
        return new Promise((resolve, reject) => {
            const changedEmp = new Employee(changedData);

            // Validate the model instance and handle the validation error's response
            const errValidation = changedEmp.validateSync();
            if ( errValidation ) {
                console.log(`[ERROR] - <EmployeesRepository.update> details: \n`, errValidation);
                return reject({
                    error: errValidation,
                    message: 'Unable to update an employee',
                    status: 400
                });
            }

            // Connect to MongoDB using mongoose
            mongoose.connect(this.mongodbUrl);
            const db = mongoose.connection;

            db.on(`error`, (err) => {
                console.log(`[ERROR] - <EmployeesRepository.update> Details: \n`, err);
                reject({ error: err, message: 'Unable to connect to database.', status: 500});        
            });
            
            Employee.findByIdAndUpdate(id, changedData, { new: true }, (err, updatedEmp ) => {
                mongoose.disconnect();

                if ( err ) {
                    console.log(`[ERROR] - <EmployeesRepository.update> Details: \n`, err);
                    return reject(err);
                }

                console.log(`[DEBUG] - <EmployeesRepository.update> updatedEmployees: \n`, updatedEmp);
                return resolve(updatedEmp);
            });
        });
    }

    /**
     * Delete record by ID
     * @param {String} empId - the ID of target record to delete
     */
    delete(empId) {
        return new Promise((resolve, reject) => {
            // Connect to MongoDb using mongoose
            mongoose.connect(this.mongodbUrl);
            const db = mongoose.connection;

            db.on(`error`, (err) => {
                console.log(`[ERROR] - <EmployeesRepository.delete> Details: \n`, err);
                reject({ 
                    error: err, 
                    message: 'Unable to connect to database.', 
                    status: 500
                });
            });

            Employee.remove( { _id: empId }, (err) => {
                mongoose.disconnect();

                if ( err ) {
                    console.log(`[ERROR] - <EmployeesRepository.delete> Details: \n`, err);
                    return reject({
                        error: err,
                        message: 'Unable to remove a record from database.',
                    });
                }
            });

            return resolve({
                message: 'Delete a record from database success.'
            });
        });
    }
}

module.exports = EmployeesRepository;
