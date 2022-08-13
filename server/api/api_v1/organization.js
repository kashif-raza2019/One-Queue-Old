const express = require('express');
const router = express.Router();
const OrganizationSchema = require('../../model/organizationDB');
const fs = require('fs');
const path = require('path');
const INITIAL_URL = '/api/_v1/';
const sendEmail = require('../../utils/mail');
const md5 = require('md5');
const registrationMailTemplate = require('../../utils/registrationMailTemplate');
const verificationMailTemplate = require('../../utils/organizationMail/verification/verificationMail');
const approvalStatusMailTemplate = require('../../utils/organizationMail/approvalStatus/approvalStatusMail');
const qrcode = require('qrcode');
const approvedMailTemplate = require('../../utils/organizationMail/approval/approval');

// Rajasthan Districts Array
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


/**
 *   Register Organization route
 */
router.post(INITIAL_URL + 'register/organization/', async (req, res) => {
    
    let orgName = req.body.name;
    let orgType = req.body.type;
    let orgEmail = req.body.email;
    let orgAddress = req.body.address;
    let orgDistrict = req.body.district;
    let orgDivision = req.body.division;
    let orgContact = req.body.contact;
    if(checkIfOrganizationExists(orgName, orgEmail, orgDistrict) === true) {
        res.status(400).send({
            message: "Organization already exists"
        });
    }else{
        let orgWebsite = req.body.website;
        let orgDescription = req.body.description;
        let orgLogo = req.body.logo;
        let orgCode = createOrganizationCode(orgDistrict);
        let orgCreatedBy = req.body.createdBy;  
        let encryptedCode = md5(orgEmail.toLowerCase());
        let oneTimePassword = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        let hashedPassword = md5(req.body.password.toLowerCase());
        const createOrganization = new OrganizationSchema({
            name : orgName,  
            code : orgCode,
            type : orgType,
            address : orgAddress,  
            contact : orgContact,
            email : orgEmail,
            password : hashedPassword,
            website : orgWebsite, 
            district : orgDistrict,
            division : orgDivision,
            description : orgDescription,
            logo : orgLogo,
            createdBy : orgCreatedBy,
            emailVerification : encryptedCode,
            otp : oneTimePassword
        });
        await createOrganization.save();

        // Send Email to the Organization
        let to = orgEmail;
        let subject = "Verify your organization account";
        let verificationUrl = "http://localhost:8080/organization/verify/" + encryptedCode;
        let message = registrationMailTemplate(verificationUrl);
        if(sendEmail(to, subject, message)) {
            res.status(200).send({
                message: "Organization registered successfully"
            });
        } else {
            res.status(500).send({
                message: "Error in sending verification mail"
            });
        }

    }
});


/**
 * Route to upload documents for the organization code
 */
router.post(INITIAL_URL + 'upload/organization/documents/', async (req, res) => {
    const organizationCode = req.body.code;
    const organization = await OrganizationSchema.findOne({code: organizationCode});
    // upload file in organization folder of uploads
    const file = req.files.file;
    const fileName = file.name;
    const filePath = path.join(__dirname, '../../../uploads/organization/' + fileName);
    file.mv(filePath, async (err) => {
        if(err) {
            res.status(500).send({
                message: "Error in uploading file"
            });
        } else {
            organization.documents.push(fileName);
            await organization.save();
            // Mail to the organization about approvalStatus
            if(sendEmail(organization.email, "Approval Status | One - Queue", approvalStatusMailTemplate)) {
                res.status(200).send({
                    message: "File uploaded successfully"
                });
            } else {
                res.status(500).send({
                    message: "Error in sending mail"
                });
            }
        }
    });
});

/**
 *  Route to verify the organization email address
 *  authAndVerified = true after verification 
 */

router.get('/organization/verify/:code', async (req, res) => {
    let code = req.params.code;
    let org = await OrganizationSchema.findOne({emailVerification : code});
    if(org) {
        org.authAndVerified = true;
        await org.save();
        // Send Email to the Organization for successful verification
        if(sendEmail(org.email, "Email verification successful", verificationMailTemplate)){
            res.status(200).send({
                message: "Email verification successful"
            });
        } else {
            res.status(500).send({
                message: "Error in sending verification mail"
            });
        }
    } else {
        res.status(400).send({
            message: "Invalid code"
        });
    }
});

// Get all the organization registered
router.get(INITIAL_URL + 'get/organization/', async (req, res) => {
   const result = await OrganizationSchema.find({});
   if(result){
       let orgList = [];
       result.forEach(element => {
              orgList.push({
                name : element.name,
                code : element.code,
                type : element.type,
                address : element.address,
                contact : element.contact,
                email : element.email,
                website : element.website,
                district : element.district,
                division : element.division,
                services: element.services,
                description : element.description,
                logo : element.logo,
                createdBy : element.createdBy,
                authAndVerified : element.authAndVerified,
                documents : element.documents
              });
       });
        // convert send data to json
        res.status(200).json({organization : orgList});
   } else {
         res.status(400).send({
              message: "No organization found"
         });
    }
    
});


// Get all the active organization
router.get(INITIAL_URL + 'get/organization/active/', async (req, res) => {
    const result = await OrganizationSchema.find({activeStatus : true});
   if(result){
       let orgList = [];
       result.forEach(element => {
              orgList.push({
                name : element.name,
                code : element.code,
                type : element.type,
                address : element.address,
                contact : element.contact,
                email : element.email,
                website : element.website,
                district : element.district,
                division : element.division,
                services: element.services,
                description : element.description,
                logo : element.logo,
                createdBy : element.createdBy,
                authAndVerified : element.authAndVerified,
                documents : element.documents
              });
       });
        // convert send data to json
        res.status(200).json({organization : orgList});
   } else {
         res.status(400).send({
              message: "No organization found"
         });
    }
    

});

// Get all the in-active organization
router.get(INITIAL_URL + 'get/organization/inactive/', async (req, res) => {
    const result = await OrganizationSchema.find({activeStatus : false});
   if(result){
       let orgList = [];
       result.forEach(element => {
              orgList.push({
                name : element.name,
                code : element.code,
                type : element.type,
                address : element.address,
                contact : element.contact,
                email : element.email,
                website : element.website,
                district : element.district,
                division : element.division,
                services: element.services,
                description : element.description,
                logo : element.logo,
                createdBy : element.createdBy,
                authAndVerified : element.authAndVerified,
                documents : element.documents
              });
       });
        // convert send data to json
        res.status(200).json({organization : orgList});
   } else {
         res.status(400).send({
              message: "No organization found"
         });
    }
    

});

// Get the organization by the district
router.get(INITIAL_URL + 'get/organization/:district', async (req, res) => {
    const districtName = req.params.district;
    let district = '';
    for(let i = 0; i < districtName.length; i++) {
        if(i === 0){
            district += districtName[i].toUpperCase();
        }else{
            district += districtName[i].toLowerCase();
        }
    }
    if(checkIfDistrictExists(district) === false) {
        res.status(400).send({
            message: "District not found"
        });
    }
    const result = await OrganizationSchema.find({district: district});
    if(result){
        let orgList = [];
        result.forEach(element => {
               orgList.push({
                 name : element.name,
                 code : element.code,
                 type : element.type,
                 address : element.address,
                 contact : element.contact,
                 email : element.email,
                 website : element.website,
                 district : element.district,
                 division : element.division,
                 services: element.services,
                 description : element.description,
                 logo : element.logo,
                 createdBy : element.createdBy,
                 authAndVerified : element.authAndVerified,
                 documents : element.documents
               });
        });
         // convert send data to json
         res.status(200).json({organization : orgList});
    } else {
            res.status(400).send({
                 message: "No organization found"
            });
         }
});

// Get the organization by the organization code
router.get(INITIAL_URL + 'get/organization/org-code/:organizationCode', async (req, res) => {
    const organizationCode_uf = req.params.organizationCode;
    let organizationCode = '';
    for(let i = 0; i < organizationCode_uf.length; i++) {
        organizationCode += organizationCode_uf[i].toUpperCase();
    }
    OrganizationSchema.findOne({organizationCode: organizationCode}, (err, result) => {
        if (err) {
            res.status(500).json({
                error: err,
                message: 'Error in getting organization'
            });
        } else {
            if(result.length === 0) {
                res.status(200).json({
                    message: 'No organization found in this district'
                });
            }else{
                res.status(200).json({ organization : result});
            }
        }
    });

});

// Get the organization by the organization division
router.get(INITIAL_URL + 'get/organization/:district/:division', async (req, res) => {
    const districtName = req.params.district;
    const divisionName = req.params.division;
    let district = '';
    for(let i = 0; i < districtName.length; i++) {
        if(i === 0){
            district += districtName[i].toUpperCase();
        }else{
            district += districtName[i].toLowerCase();
        }
    }
    OrganizationSchema.find({organizationDistrict: district, organizationDivision : division}, (err, result) => {
        if (err) {
            res.status(500).json({
                error: err,
                message: 'Error in getting organization'
            });
        } else {
            if(result.length === 0) {
                res.status(200).json({
                    message: 'No organization found in this district\'s division'
                });
            }else{
                res.status(200).json({ organization : result});
            }
        }
    });

});

// Update the organization by the organization code
router.put(INITIAL_URL + 'update/organization/:organizationCode', async (req, res) => {
    const organizationCode_uf = req.params.organizationCode;
    const organization = req.body;
    // Update the data of the organization without updating organization code
    const organizationData = {
        name: organization.name,
        district: organization.district,
        division: organization.division,
        address: organization.address,
        phone: organization.phone,
        email: organization.email,
        website: organization.website,
        description: organization.description,
        logo: organization.logo,
    };
    const updatedOrganization = await OrganizationSchema.findOneAndUpdate({code: organizationCode_uf}, organizationData, {new: true});
    if(updatedOrganization) {
        if(sendEmail(updatedOrganization.email, "Organization updated", "Your organization data has been updated")){
            res.status(200).json({
                message: 'Organization updated successfully'
            });
        } else {
            res.status(500).json({
                message: 'Error in sending mail'
            });
        }
    } else {
        res.status(500).json({
            message: 'Error in updating organization'
        });
    }
});

// Delete the organization by the organization code
router.delete(INITIAL_URL + 'delete/organization/:organizationCode', async (req, res) => {
    const organizationCode_uf = req.params.organizationCode;
    if(organizationCode_uf === 'OQ330000001') {
        res.status(500).json({
            message: 'Cannot delete the organization'
        });
    }
    const organization = await OrganizationSchema.findOne({code: organizationCode_uf});
    if(organization) {
        await OrganizationSchema.findOneAndDelete({code: organizationCode_uf});
        if(sendEmail(organization.email, "Organization deleted", "Your organization has been deleted")){
            res.status(200).json({
                message: 'Organization deleted successfully'
            });
        } else {
            res.status(500).json({
                message: 'Error in sending mail'
            });
        }
    } else {
        res.status(500).json({
            message: 'Error in deleting organization'
        });
    }
});



// Function to be used for the routes and api calls

/**
 *      Generate Organization Code from District Name
 *      Specific to a district
 *      Example --> OQ070000012 
 * @param {} organizationDistrict 
 * @returns organizationCode
 */
 function createOrganizationCode(organizationDistrict) {
    let numberOfRegisteredOrganization = getNumberOfOrganizationRegistered();
    numberOfRegisteredOrganization++;
    let organizationNumber = numberOfRegisteredOrganization;
    let districtCode = 0;
    //Map index to district code in rajasthanArray
    for(let i = 0; i < rajasthanArr.length; i++) {
        if(rajasthanArr[i] === organizationDistrict) {
            districtCode = i + 1;
            break;
        }
    }
    // 0000000 padding for organization number
    let organizationCode = "OQ" + districtCode + organizationNumber.toString().padStart(7, '0');
    return organizationCode;
}

/**
 *     Get the count of total organizations registered for the district
 * No parameters
 * @returns {number} number of organizations registered
 */

function getNumberOfOrganizationRegistered(district){
    // get the recent organization added
    const organization = OrganizationSchema.findOne({}, {}, { sort: { 'createdAt': -1 } });
    let get = organization.idNum;
    // last element of code
    if(get == 0 || get == null || get == undefined || get == NaN) {
        return 1;
    }
    return get;
}


/**
 *  Function to check if the organization is already present in the database
 * 
 * @param {*} orgName 
 * @param {*} orgEmail 
 * @param {*} orgDistrict 
 * @returns boolean
 */
function checkIfOrganizationExists(orgName, orgEmail, orgDistrict) {
    const checkExist = OrganizationSchema.findOne({name: orgName, email: orgEmail, district: orgDistrict});
    if(checkExist) {
        return false;
    } 
    return true;
}
/**
 *  Function to check if the district exists in rajasthanArray
 */
function checkIfDistrictExists(district) {
    for(let i = 0; i < rajasthanArr.length; i++) {
        if(rajasthanArr[i] === district) {
            return true;
        }
    }
    return false;
}


module.exports = router;