const express = require('express');
const router = express.Router();
const UserSchema = require('../../model/users');
const OrganizationSchema = require('../../model/organizationDB');
const INITIAL_URL = '/api/_v1/';

/**
 *             User Api
 * 
 */
 
// User Registration
router.post(INITIAL_URL + 'register/user', async (req, res) => {
    const userContact = req.body.contact;
    const userGender = req.body.userGender;
    const userAge = req.body.userAge;
    const orgId = req.body.orgId;
    const serviceCode = req.body.serviceCode;
    const organization = await OrganizationSchema.findById(orgId);
    const service = organization.services.find(service => service.serviceCode === parseInt(serviceCode, 10));
    const counters = service.counter;

});


