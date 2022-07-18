const express = require('express');
const router = express.Router();

// API VERSION 1 ROUTE
const API_V1_ROUTE = require('./api_v1');

// Direct the API to the current version

router.use(API_V1_ROUTE);

module.exports = router;