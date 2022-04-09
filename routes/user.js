const express = require('express');
const router = express.Router();

// User View Routes
router.get('/user', (req, res) => {
    res.send('Welcome to the user page');
});

router.get('/gettoken', (req, res) => {
    res.send('Welcome to the gettoken page');
});

router.post('/viewtoken', (req, res) => {
    res.send('Welcome to the viewtoken page');
});

router.get('/verifytoken', (req, res) => {
    res.send('Welcome to the verifytoken page');
});

router.get('/canceltoken', (req, res) => {
    res.send('Welcome to the canceltoken page');
});

router.get('/reschedule', (req, res) => {
    res.send('Welcome to the reschedule token page');
});

module.exports = router;