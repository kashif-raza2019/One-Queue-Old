const path = require('path');
const express = require('express');
const ROUTER = express.Router();
const INITIAL_URL = '/api/_v1/';
const jwt = require('jsonwebtoken');
// Documentation Route
ROUTER.get(INITIAL_URL + 'Documentation/', (req, res) => {
    const token = jwt.sign({
             data: 'some data'
        }, process.env.JWT_KEY, { expiresIn: '1h' });
    console.log(token);
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };
    let options = {
        url: 'http://localhost:3000/api/_v1/Documentation/',
        headers: headers
    };
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'api-documentation.html' ), options);
    // res.send({
    //     message: 'Hello World',
    //     token: token
    // })
});

module.exports = ROUTER;