const express = require('express');
const router = express.Router();
const EmployeesRepository = require('../repositories/employees-repository');

const MONGODB_URL = 'mongodb+srv://dila:Helloworld123@cluster0-82r3u.mongodb.net/bit-carrot';

/**
 * Get all employees on the database
 * HTTP Verb: GET
 * Path Endpoint: /api/employees
 */
router.get('/', async(req, res, next) => {
    const respository = new EmployeesRepository(MONGODB_URL);
    try {
        const employees = await respository.getAll();
        res.status(200).json(employees);
    } catch (err) {
        res.status(err.status).send(err);
    }
});

/**
 * Get an employee by id from database
 * HTTP Verb: GET
 * Path Endpoint: /api/employees/{empId}
 */
router.get('/:empId', async(req, res, next) => {
    const empId = req.params.empId;
    const respository = new EmployeesRepository(MONGODB_URL);
    try {
        const employee = await respository.get(empId);
        res.status(200).json(employee);
    } catch (err) {
        res.status(err.status).send(err);
    }
});

/**
 * Create a new Employee on the database
 * HTTP Verb: POST
 * Path Endpoint: /api/employees
 */
router.post('/', async (req, res, next) => {
    const respository = new EmployeesRepository(MONGODB_URL);
    try {
        const createdEmp = await respository.createEmployee(req.body);
        res.status(200).json(createdEmp);
    } catch ( err ) {
        res.status(err.status).json(err);
    }
});

/**
 * Update an employee on database
 * HTTP Verb: PUT
 * Path endpoint: /api/employees/{empId}
 */
router.put("/:empId", async(req, res, next) => {
    try {
        const changedEmp = await doUpdate(res, req);
        res.status(200).json(changedEmp);
    } catch (err) {
        res.status(err.status).send(err);
    }
});

/**
 * Update an employee on database
 * HTTP Verb: PATCH
 * Path endpoint: /api/employees/{empId}
 */
router.patch("/:empId", async(req, res, next) => {
    try {
        const changedEmp = await doUpdate(res, req);
        res.status(200).json(changedEmp);
    } catch (err) {
        res.status(err.status).send(err);
    }
});

/**
 * Delete an existing Employee data record on the database
 * by specific ID
 * Path endpoint: /api/employees/{empId}
 */
router.delete('/:empId', async(req, res, next) => {
    const empId = req.params.empId;
    const repository = new EmployeesRepository(MONGODB_URL);
    try {
        const response = await repository.delete(empId);
        res.status(200).json(response);
    } catch ( err ) {
        return res.status(err.status).send(err);
    }
});

/**
 * A helper to handle update data on database.
 * @param {*} res - Express Response object
 * @param {*} req - Express Request object
 */
async function doUpdate(res, req) {

    const empId = req.params.empId;
  
    const changedEmp = req.body;
  
    const repository = new EmployeesRepository(MONGODB_URL);
  
    return repository.update(empId, changedEmp);
  
  }

module.exports = router;