/**
 *              API VERSION 1 
 * This is the first version of the API.
 * Refer Google Doc: https://docs.google.com/document/d/1aaRhfZdGcMAyfUyL9sPnf82f_cqVMONB5gfHSjNBhUc/edit
 * Route: /api/_v1/  
 */                      
const express = require('express');
const router = express.Router();

/**
 *             API VERSION 1 PATHS
 */
const mail = require('./api_v1/mail');
const documentation = require('./api_v1/documentation');
const getSingleDistrict = require('./api_v1/getSingleDistricts');
const getDistrict = require('./api_v1/getDistrict');

// Organization
const typesOfOrganization = require('./api_v1/provideTypesOfOrganization');
const registerOrganization = require('./api_v1/registerOrganization');

/**
 *             API VERSION 1 ROUTES
 */

// Organization Registration Routes
router.use(typesOfOrganization);
router.use(registerOrganization);

// District Routes
router.use(getSingleDistrict);
router.use(getDistrict);

// Mail API
router.use(mail);

// Documentation API
router.use(documentation);



module.exports = router;