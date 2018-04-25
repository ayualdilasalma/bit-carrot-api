var express = require('express');
var router = express.Router();
var User = require('../models/users-model');
var UsersRepository = require('../repositories/users-repository');
var app = express();
app.set('secret', 'iwebdevcarrot'); 

const MONGODB_URL = 'mongodb+srv://dila:Helloworld123@cluster0-82r3u.mongodb.net/bit-carrot';

/**
 * Create a new User on the database
 * HTTP Verb: POST
 * Path Endpoint: /users/
 */
router.post('/', async (req, res, next) => {
    const repository = new UsersRepository(MONGODB_URL);
    try {
        const authUser = await repository.createUser(req.body);
        res.status(200).json(authUser);
    } catch ( err ) {
        res.status(err.status).json(err);
    } 
});

/**
 * Get all users on the database
 * HTTP Verb: GET
 * Path Endpoint: /users/
 */
router.get('/', async(req, res, next) => {
    const repository = new UsersRepository(MONGODB_URL);
    try {
        const users = await repository.getAll();
        res.status(200).json(users);
    } catch ( err ) {
        res.status(err.status).send(err);
    }
});

/**
 * Get token for current user
 * HTTP Verb: POST
 * Path Endpoint: /users/authenticate
 */
router.post('/authenticate', async (req, res, next) => {
    const repository = new UsersRepository(MONGODB_URL);
    try {
        const authUser = await repository.authenticate(req.body);
        res.status(200).json(authUser);
    } catch ( err ) {
        res.status(err.status).json(err);
    } 
});

module.exports = router;
