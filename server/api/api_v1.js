/**
 *              API VERSION 1 
 * This is the first version of the API.
 * Refer Google Doc: https://docs.google.com/document/d/1aaRhfZdGcMAyfUyL9sPnf82f_cqVMONB5gfHSjNBhUc/edit
 * Route: /api/_v1/  
 */

const path = require('path');
const express = require('express');
const ROUTER = express.Router();
const INITIAL_URL = '/api/_v1/';
// Mailer function
const sendMail = require('../utils/mail');
/*
    District details API
*/
const rajasthanJson = require('../utils/rajasthan.json');
ROUTER.get(INITIAL_URL + 'District/', (req, res) => {
    res.json(rajasthanJson);
});

ROUTER.get(INITIAL_URL + 'District/:district', (req, res) => {
    const district = req.params.district;
    if(getDistrict(district)) {
        res.json(district);
    }
    else {
        res.status(404).json( 'District not found');
    }
});

function getDistrict(district) {
    for(var i = 0; i < rajasthanJson.districts.length; i++) {
        if(rajasthanJson.districts[i] == district) {
            return true;
        }
    }
    return false;
}

// **** END OF DISTRICT DETAILS API ****

// **** START OF MAILING ****
ROUTER.get(INITIAL_URL + 'mail/:userId/:subject/:message', (req, res) => {
    const to = req.params.userId;
    const subject = req.params.subject;
    const message = req.params.message;
    if(sendMail(to, subject, message)){
        res.status(200).json('Mail sent successfully');
    }else{
        res.status(500).json('Mail sending failed');
    }

});

// Documentation Route
ROUTER.get(INITIAL_URL + 'Documentation/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'api-documentation.html' ));
});







module.exports = ROUTER;