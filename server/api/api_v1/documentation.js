const path = require('path');
const express = require('express');
const ROUTER = express.Router();
const INITIAL_URL = '/api/_v1/';
// Documentation Route
ROUTER.get(INITIAL_URL + 'Documentation/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'api-documentation.html' ));
});

module.exports = ROUTER;