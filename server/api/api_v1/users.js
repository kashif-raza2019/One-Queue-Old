const express = require('express');
const router = express.Router();
const UserSchema = require('../../model/users');
const INITIAL_URL = '/api/_v1/';

/**
 *             User Api
 * 
 */
 
// User Registration
router.post(INITIAL_URL + 'register/user', (req, res) => {
    

});