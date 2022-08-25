const express = require('express');
const router = express.Router();

// API VERSION 1 ROUTE
const API_V1_ROUTE = require('./api_v1');

// Direct the API to the current version
// Authenticate the header before proceeding
router.use(API_V1_ROUTE);


// Test API route
router.get('/testdata', (req, res) => {
    res.json({
        message: 'API is working',
        data: {
            name: 'John Doe',
            age: '30'
        }
        
    });
});

module.exports = router;