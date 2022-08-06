const express = require('express');
const ROUTER = express.Router();
const INITIAL_URL = '/api/_v1/';
// Mailer function
const sendMail = require('../../utils/mail');

// **** START OF MAILING ****
ROUTER.post(INITIAL_URL + 'mail/:userId/:subject/:message', (req, res) => {
    const to = req.params.userId;
    const subject = req.params.subject;
    const message= req.params.message;
    console.log(message);
    if(sendMail(to, subject, message)){
        res.status(200).json('Mail sent successfully');
    }else{
        res.status(500).json('Mail sending failed');
    }

});

module.exports = ROUTER;