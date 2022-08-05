const express = require('express');
const ROUTER = express.Router();
const rajasthanJson = require('../../utils/rajasthan.json');
const INITIAL_URL = '/api/_v1/';

ROUTER.get(INITIAL_URL + 'District/', (req, res) => {
    res.json(rajasthanJson);
});


module.exports = ROUTER;