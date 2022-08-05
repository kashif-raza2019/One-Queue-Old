const express = require('express');
const router = express.Router();
const OrganizationSchema = require('../../model/organizationDB');
const INITIAL_URL = '/api/_v1/';

const rajasthanArr = [
   'Ajmer',
   'Alwar',
   'Banswara',
   'Baran',
   'Barmer',
   'Bharatpur',
   'Bhilwara',
   'Bikaner',
  'Bundi',
   'Chittorgarh',
   'Churu',
   'Dausa',
   'Dholpur',
   'Dungarpur',
   'Hanumangarh',
   'Jaipur',
   'Jaisalmer',
   'Jalore',
   'Jhalawar',
   'Jhunjhunu',
   'Jodhpur',
   'Karauli',
   'Kota',
   'Nagaur',
   'Pali',
   'Pratapgarh',
   'Rajsamand',
   'Sawai Madhopur',
   'Sikar',
   'Sirohi',
   'Sri Ganganagar',
   'Tonk',
   'Udaipur'

];

router.post(INITIAL_URL + '/register/organization/', async (req, res) => {
    const name = req.body.organizationName;
    // We need to create the organization 
    const type = req.body.organizationType;
    const address = req.body.organizationAddress;
    const phone = req.body.organizationPhone;
    const email = req.body.organizationEmail;
    const website = req.body.organizationWebsite;
    const district = req.body.organizationDistrict;
    const division = req.body.organizationDivision;
    const description = req.body.organizationDescription;
    const logo = req.body.organizationLogo;
    const createdBy = req.body.createdBy;
    const createdAt = new Date();
    const organizationCode = createOrganizationCode(name, type, district);
    const createOrganization = new OrganizationSchema({
        organizationName: name,
        organizationCode: organizationCode,
        organizationType: type,
        organizationAddress: address,
        organizationPhone: phone,
        organizationEmail: email,
        organizationWebsite: website,
        organizationDistrict: district,
        organizationDivision: division,
        organizationDescription: description,
        organizationLogo: logo,
        organizationCreated: createdAt,
        activeStatus: false,
        createdBy: createdBy,
        numberOfAllowedTokens: 0,
        currentTraffic: 0,
        previousDayTraffic: 0,
        trafficStatusColor: "Green",
        currentTokenServed: "None",
        previousTokenServed: "None",
        nextTokenServed: "None",
        qrCodeUrl: "None",
        lastTimeActive: createdAt,
        rating: 2.5,
        organizationApprovalStatus: false
    });
    // Save the data into database
    createOrganization.save((err, result) => {
        if (err) {
            res.status(500).json({
                error: err,
                message: 'Error in creating organization'
            });
        } else {
            res.status(200).json({
                message: 'Organization created successfully',
                organization: result
            });
        }
    });

});

function createOrganizationCode(organizationName, organizationType, organizationDistrict) {
    let organizationCode = '';
    organizationCode += organizationName.substring(0, 3);
    organizationCode += '-';
    organizationCode += organizationType.substring(0, 3);
    organizationCode += '-';
    organizationCode += organizationDistrict.substring(0, 3);
    organizationCode += '-';
    let randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    let countDistrictNumber = 0;
    // Count the number of districts in Rajasthan
    for(let i = 0; i < rajasthanArr.length; i++) {
        if(rajasthanArr[i] === organizationDistrict) {
            countDistrictNumber = i;
        }
    }
    organizationCode += countDistrictNumber.toString();
    organizationCode += '-';
    organizationCode += randomNumber.toString();
    return organizationCode.toUpperCase();
}


module.exports = router;