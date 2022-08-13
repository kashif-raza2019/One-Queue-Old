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

const organizationType = [
    'Rajasthan Rajya Vidyut Utpadan Nigam Ltd.', 
    'Rajasthan Rajya Vidyut Prasaran Nigam Ltd.', 
    'Rajasthan State Mines & Minerals Ltd.', 
    'Metro Manas Arogya Sadan Heart Care and Multi - Speciality Hospital',
    'Rajasthan State Health and Family Welfare Society',
    'Agarwal Hospital, Sawai Madhopur Road',
    'Amar Medical & Research Centre',
    'Apex Hospital Mansarovar Pvt Ltd',
    'Bhandari Hospital and Research Centre',
    'Bindal Hospital',
    'Brijesh Bangar Memorial Hospital',
    'CKRD Memorial Hospital & Research Institute',
    'Dana Shivam Heart and SuperSpeciality Hospital',
    'Dr. Choudhary Hospital and Medical Research Centre Pvt. Ltd.',
    'Eternal Heart Care Centre and Research Institute Pvt Ltd.',
    'Fortis Escorts Hospital, Malviya Nagar',
    'Gangauri Hospital',
    'Getwell Hospital and Research Centre',
    'Goyal Hospital & Research Centre Pvt. Ltd.',
    'Harish Hospital Pvt. Ltd.',
    'Indus Jaipur Hospital',
    'Jaipur Hospital',
    'ABC BOOK DEPOT',
    'DEF BOOK DEPOT',
    'GHI BOOK DEPOT',
    'JKL BOOK DEPOT',
    'MNO BOOK DEPOT',
    'PQR BOOK DEPOT',
    'STU BOOK DEPOT',
    'VWX BOOK DEPOT',
    'YZ BOOK DEPOT',
    'ZYX BOOK DEPOT',
    'ABC BUS STOP',
    'DEF BUS STOP',
    'GHI BUS STOP',
    'JKL BUS STOP',
    'MNO BUS STOP',
    'PQR BUS STOP',
    'STU BUS STOP',
    'VWX BUS STOP',
    'YZ BUS STOP',
    'ZYX BUS STOP',
    'Collectorate Office',
    'Department of Environment',
    'Department of Health',
    'Department of Human Resources',
    'Department of Revenue',
    'Department of Social Welfare',
    'Documents and Records Office',
    'External Affairs Office',
    'Rajasthan Electricity Board',
    'Rajasthan Fire and Police Board',
    'Rajasthan Forest Department',
    'Rajasthan Union Bank',
    'Rajasthan Water Board',
    'Rajasthan Zilla Parishad'
]

const dummy_address = "Dummy Address, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod,";
const dummy_description = "Dummy Data for Operational and working test purposes, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod,Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod,Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod,Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod,";
const dummy_createdBy = "Developer Admin";
const dummy_phone = '+91-9999999999';
const dummy_email = 'kashifraza08012001@gmail.com';
const dummy_password = 'dummyPassword';
const dummy_website = 'https://www.github.com/kashif-raza2019/One-Queue';

// Dummy Image String 
const imageString = ''

function performDummyDataInsertion() {
    console.log('Performing Dummy Data Insertion');
    for (let i = 0; i < rajasthanArr.length; i++) {
        for(let j = 0; j < organizationType.length; j++) {
            let name = organizationType[j] + ' ' + rajasthanArr[i];
            let code = createOrganizationCode(name, organizationType[j], rajasthanArr[i]);
            let type = organizationType[j];
            let address = dummy_address + ' ' + rajasthanArr[i];
            let description = dummy_description + ' ' + rajasthanArr[i];
            let createdBy = dummy_createdBy;
            let phone = dummy_phone;
            let email = dummy_email;
            let district = rajasthanArr[i];
            let password = dummy_password;
            let image = imageString;
            let website = dummy_website;
            const createDummyOrganization = new OrganizationSchema({
                organizationName: name,
                organizationCode: code,
                organizationType: type,
                organizationAddress: address,
                organizationPhone: phone,
                organizationEmail: email,
                organizationPassword: password,
                organizationWebsite: website,
                organizationDistrict: district,
                organizationDivision : 'Rajasthan',
                organizationLogo: image,
                organizationDescription: description,
                createdBy: createdBy
            });
            createDummyOrganization.save();
        }
    }
    console.log('Dummy Data Insertion Completed');
}

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

router.get(INITIAL_URL + 'test-data/add-organization/', async (req, res) => {
    performDummyDataInsertion();
    res.status(200).json({
        message: 'Test Data Insertion Completed'
    });
});

module.exports = router;