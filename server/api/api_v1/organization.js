const express = require('express');
const router = express.Router();
const OrganizationSchema = require('../../model/organizationDB');
const User = require('../../model/users');
const fs = require('fs');
const path = require('path');
const INITIAL_URL = '/api/_v1/';
const sendEmail = require('../../utils/mail');
const md5 = require('md5');
const registrationMailTemplate = require('../../utils/registrationMailTemplate');
const verificationMailTemplate = require('../../utils/organizationMail/verification/verificationMail');
const approvalStatusMailTemplate = require('../../utils/organizationMail/approvalStatus/approvalStatusMail');
const qrcode = require('qrcode');
const socket = require('socket.io');
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
 *   1. Register Organization route
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
 *  2. Route to upload documents for the organization code
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
 * Route to delete the organization via it's unique code
 */
router.delete(INITIAL_URL + 'delete/organization/code/:code', async (req, res) => {
    const code = req.params.code;
    const organization = await OrganizationSchema.findOne({code: code});
    if(organization) {
        await OrganizationSchema.deleteOne({code: code});
        res.status(200).send({
            message: "Organization deleted successfully"
        });
    } else {
        res.status(400).send({
            message: "Organization not found"
        });
    }
});
/**
 * Route to Delete Organization via it's _id
 */
router.delete(INITIAL_URL + 'delete/organization/:id', async (req, res) => {
    const id = req.params.id;
    if(id.length === 24) {
        const organization = await OrganizationSchema.findOne({_id: id});
        if(organization) {
            await OrganizationSchema.deleteOne({_id: id});
            res.status(200).send({
                message: "Organization deleted successfully"
            });
        } else {
            res.status(400).send({
                message: "Organization not found"
            });
        }
    }else{
        res.status(400).send({
            message: "Invalid id"
        });
    }
});

/**
 *  3. Route to verify the organization email address
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

// 4. Get all the organization registered
router.get(INITIAL_URL + 'get/organization/', async (req, res) => {
   const result = await OrganizationSchema.find({});
   if(result){
       let orgList = [];
       result.forEach(element => {
              orgList.push({
                _id: element._id,
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

// 5. Get all the active organization
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

// 6. Get all the in-active organization
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

// 7. Get the organization by the district
router.get(INITIAL_URL + 'get/organization/:id', async (req, res) => {
    const id = req.params.id;
    if(id.length < 24 || id.length > 24) {
        res.status(400).send({
            message: "Invalid id"
        });
    }else {
        const result = await OrganizationSchema.find({_id: id});
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
    }
});

// 8. Get the organization by the district
router.get(INITIAL_URL + 'get/organization/district/:district', async (req, res) => {
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

// 9. Get the organization by the organization code
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

// 10. Get the organization by the organization division
router.get(INITIAL_URL + 'get/organization/district/:district/:division', async (req, res) => {
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

// 11. Update the organization by the organization code
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

/**
 *  12. Create a Service for the organization
 */
router.post(INITIAL_URL + 'organization/create/service', async (req, res) => {
    // Service Details
    const organizationCode = req.body.code;
    const serviceName = req.body.serviceName;
    const serviceRole = ["editor", "viewer"];
    const adminName = req.body.adminName;
    const adminEmail = req.body.adminEmail;
    const adminPhone = req.body.adminPhone;
    const adminPassword = req.body.adminPassword;
    let adminAlternateEmail = req.body.adminAlternateEmail;

    if(adminAlternateEmail === undefined) {
        adminAlternateEmail = "";
    }
    if(!adminPassword || !adminEmail || !adminName || !adminPhone) {
        res.status(500).json({
            message: 'Entries are required'
        });
    }else{
        const canBeDeleted = true;
        const organization = await OrganizationSchema.findOne({code: organizationCode});
        if(organization) {
            let serviceLength = organization.services.length;
            let newServiceCode = serviceLength + 1;
            let linkForQr = "http://localhost:3000/regPage/" + organization._id + "?service=" + newServiceCode;
            // Create URL QR Code
            qrcode.toDataURL(linkForQr,async function (err, url) {
                if (err) {
                    console.error(err)
                    res.status(500).json({
                        message: 'Error in creating QR code'
                    });
    
                } else {
                const newService = {
                        serviceName: serviceName,
                        serviceCode: newServiceCode,
                        role: serviceRole,
                        adminName: adminName,
                        adminEmail: adminEmail,
                        adminPhone: adminPhone,
                        adminAlternateEmail: adminAlternateEmail,
                        qrcode: url,
                        counter: [],
                        adminPassword: md5(adminPassword),
                        canBeDeleted: canBeDeleted,
                }
                    // Add new service to the services array of objects in organization
                        const _id =  organization._id;
                        const services = organization.services;
                        services.push(newService);
                        const updatedOrganization = await OrganizationSchema.findOneAndUpdate({_id: _id}, {services: services}, {new: true});
                        if(updatedOrganization) {
                            if(sendEmail(adminEmail, "Service created", "Your service has been created") && sendEmail(adminAlternateEmail, "Service created", "Your service has been created")){
                                res.status(200).json({
                                    message: 'Service created successfully',
                                    qrCodeImage: url
                                });
                            }else{
                                res.status(500).json({
                                    message: 'Error in sending mail'
                                });
                            }
                        } else {
                            res.status(500).json({
                                message: 'Error in creating service'
                            });
                        }
                }
            });
        } else {
            res.status(500).json({
                message: 'Organization not found'
            });
        }
    
    }
});

/**
 *  @Date : 2022-08-16
 *  @Author : MD KASHIF RAZA
 *  @Description : Api for Services and Counters of an organization
 *  @param : _id of the organization
 *  @param : serviceCode of the service
 *  @param : counterName of the counter
 */

/**
 *  13. Get all services of the organization
 */
router.get(INITIAL_URL + 'organization/get/service/:id', async (req, res) => {
    const ID = req.params.id;
    if(ID.length !== 24) {
        res.status(500).json({
            message: 'Invalid ID'
        });
    } else {
        const organization = await OrganizationSchema.findById(ID);
        if(organization) {
            res.status(200).json({ services: organization.services });
        } else {
            res.status(500).json({
                message: 'Error in getting services'
            });
        }
    }
});

/**
 *  14. Delete a service of the organization
 */
router.delete(INITIAL_URL + 'organization/delete/service/:id', async (req, res) => {
    const ID = req.params.id;
    const serviceCode = req.body.serviceCode;
    if(ID.length !== 24) {
        res.status(500).json({
            message: 'Invalid ID'
        });
    } else {
        const organization = await OrganizationSchema.findById(ID);
        if(organization) {
            const services = organization.services;
            const service = services.find(service => service.serviceCode === serviceCode);
            if(service && service.canBeDeleted) {
                const index = services.indexOf(service);
                services.splice(index, 1);
                const updatedOrganization = await OrganizationSchema.findOneAndUpdate({_id: ID}, {services: services}, {new: true});
                if(updatedOrganization) {
                    res.status(200).json({
                        message: 'Service deleted successfully'
                    });
                } else {
                    res.status(500).json({
                        message: 'Error in deleting service'
                    });
                }
            } else {
                res.status(500).json({
                    message: 'Service not found'
                });
            }
        } else {
            res.status(500).json({
                message: 'Error in getting services'
            });
        }
    }
})

/**
 *   15. Update the Service of the organization
 */
router.put(INITIAL_URL + 'organization/update/service/:id', async (req, res) => {
    const ID = req.params.id;
    if(ID.length !== 24) {
        res.status(500).json({
            message: 'Invalid ID'
        });
    } else {
        const serviceCode = req.body.serviceCode;
        const serviceName = req.body.serviceName;
        const serviceRole = ["editor", "viewer"];
        const adminName = req.body.adminName;
        const adminEmail = req.body.adminEmail;
        const adminPhone = req.body.adminPhone;
        const adminPassword = req.body.adminPassword;
        let adminAlternateEmail = req.body.adminAlternateEmail;
        if(adminAlternateEmail === undefined) {
            adminAlternateEmail = "";
        }
        // Change only those fields which are provided
        if(!adminPassword || !adminEmail || !adminName || !adminPhone) {
            res.status(500).json({
                message: 'Entries are required'
            });
        } else {
            const organization = await OrganizationSchema.findById(ID);
            if(organization) {
                const services = organization.services;
                const service = services.find(service => service.serviceCode === serviceCode);
                if(service) {
                    service.serviceName = serviceName;
                    service.adminName = adminName;
                    service.adminEmail = adminEmail;
                    service.adminPhone = adminPhone;
                    service.adminAlternateEmail = adminAlternateEmail;
                    service.adminPassword = md5(adminPassword);
                    const updatedOrganization = await OrganizationSchema.findOneAndUpdate({_id: ID}, {services: services}, {new: true});
                    if(updatedOrganization) {
                        res.status(200).json({
                            message: 'Service updated successfully'
                        });
                    } else {
                        res.status(500).json({
                            message: 'Error in updating service'
                        });
                    }
                } else {
                    res.status(500).json({
                        message: 'Service not found'
                    });
                }
            } else {
                res.status(500).json({
                    message: 'Error in getting services'
                });
            }
        }
}
});

/**
 *   16. Create a counter for a service
 */
router.post(INITIAL_URL + 'organization/create/counter/:id/:serviceCode', async (req, res) => {
    const ID = req.params.id;
    const serviceCode = req.params.serviceCode;
    if(ID.length !== 24) {
        res.status(500).json({
            message: 'Invalid ID'
        });
    } else {
        // console.log("ID -------------> " + ID);
        // console.log("serviceCode -------------> " + serviceCode);
        const organization = await OrganizationSchema.findById(ID);
        // console.log(organization);
        if(organization) {
            const services = organization.services;
            const service = services.find(service => service.serviceCode === parseInt(serviceCode, 10));
            // console.log("------------------------------------Services Array--------------------------");
            // console.log(services);
            // console.log("------------------------------------Service--------------------------");
            // console.log(service);
            if(service) {
                const counter = service.counter;
                const newCounter = {
                    counterName : req.body.counterName,
                    counterNumber : req.body.counterNumber,
                    counterManager : req.body.counterManager,
                    tokenTimings : [],
                    counterStatus : false,
                    currentDayTokens : 0,
                    currentDayTokensAvailable : 0,
                    previousDayTokens: 0,
                    totalTokens: 0,
                    trafficStatus: "Low",
                    trafficStatusColor: "green",
                    queues: []
                };
                counter.push(newCounter);
                service.counter = counter;
                const updatedOrganization = await OrganizationSchema.findOneAndUpdate({_id: ID}, {services: services}, {new: true});
                if(updatedOrganization) {
                    res.status(200).json({
                        message: 'Counter created successfully'
                    });
                }
                else {
                    res.status(500).json({
                        message: 'Error in creating counter'
                    });
                }
            } else {
                res.status(500).json({
                    message: 'Service not found'
                });
            }
        } else {
            res.status(500).json({
                message: 'Error in getting services'
            });
        }
    }
});

/**
 *   17. Get all counters of a service
 */
router.get(INITIAL_URL + 'organization/get/counters/:id/:serviceCode', async (req, res) => {
    const ID = req.params.id;
    const serviceCode = req.params.serviceCode;
    if(ID.length !== 24) {
        res.status(500).json({
            message: 'Invalid ID'
        });
    } else {
        const organization = await OrganizationSchema.findById(ID);
        if(organization) {
            const services = organization.services;
            const service = services.find(service => service.serviceCode === serviceCode);
            if(service) {
                res.status(200).json({
                    counters: service.counter
                });
            } else {
                res.status(500).json({
                    message: 'Service not found'
                });
            }
        } else {
            res.status(500).json({
                message: 'Error in getting services'
            });
        }
    }
});

/**
 *   18. Update the counter of the service
 */
router.put(INITIAL_URL + 'organization/update/counter/:id/:serviceCode', async (req, res) => {
    const ID = req.params.id;
    const serviceCode = req.params.serviceCode;
    if(ID.length !== 24) {
        res.status(500).json({
            message: 'Invalid ID'
        });
    } else {
        const organization = await OrganizationSchema.findById(ID);
        if(organization) {
            const services = organization.services;
            const service = services.find(service => service.serviceCode === serviceCode);
            if(service) {
                const counter = service.counter;
                const counterIndex = counter.findIndex(counter => counter.counterName === req.body.counterName);
                if(counterIndex !== -1) {
                    counter[counterIndex].counterName = req.body.counterName;
                    counter[counterIndex].counterNumber = req.body.counterNumber;
                    counter[counterIndex].counterManager = req.body.counterManager;
                    const updatedOrganization = await OrganizationSchema.findOneAndUpdate({_id: ID}, {services: services}, {new: true});
                    if(updatedOrganization) {
                        res.status(200).json({
                            message: 'Counter updated successfully'
                        });
                    } else {
                        res.status(500).json({
                            message: 'Error in updating counter'
                        });
                    }
                } else {
                    res.status(500).json({
                        message: 'Counter not found'
                    });
                }
            } else {
                res.status(500).json({
                    message: 'Service not found'
                });
            }
        } else {
            res.status(500).json({
                message: 'Error in getting services'
            });
        }
    }
});

/**
 *   19. Delete the counter of the service
 */
router.delete(INITIAL_URL + 'organization/delete/counter/:id/:serviceCode', async (req, res) => {
    const ID = req.params.id;
    const serviceCode = req.params.serviceCode;
    if(ID.length !== 24) {
        res.status(500).json({
            message: 'Invalid ID'
        });
    } else {
        const organization = await OrganizationSchema.findById(ID);
        if(organization) {
            const services = organization.services;
            const service = services.find(service => service.serviceCode === serviceCode);
            if(service) {
                const counter = service.counter;
                const counterIndex = counter.findIndex(counter => counter.counterName === req.body.counterName);
                if(counterIndex !== -1) {
                    counter.splice(counterIndex, 1);
                    const updatedOrganization = await OrganizationSchema.findOneAndUpdate({_id: ID}, {services: services}, {new: true});
                    if(updatedOrganization) {
                        res.status(200).json({
                            message: 'Counter deleted successfully'
                        });
                    } else {
                        res.status(500).json({
                            message: 'Error in deleting counter'
                        });
                    }
                } else {
                    res.status(500).json({
                        message: 'Counter not found'
                    });
                }
            } else {
                res.status(500).json({
                    message: 'Service not found'
                });
            }
        } else {
            res.status(500).json({
                message: 'Error in getting services'
            });
        }
    }
});

/**
 * Update the token timings, current day tokens, maximum token in counters of service for organization
 */
router.put(INITIAL_URL + 'organization/update/counter/token/:id/:serviceCode', async (req, res) => {
    const ID = req.params.id;
    const serviceCode = req.params.serviceCode;
    if(ID.length !== 24) {
        res.status(500).json({
            message: 'Invalid ID'
        });
    } else {
        const organization = await OrganizationSchema.findById(ID);
        if(organization) {
            const services = organization.services;
            const service = services.find(service => service.serviceCode === serviceCode);
            if(service) {
                const counter = service.counter;
                const counterIndex = counter.findIndex(counter => counter.counterName === req.body.counterName);
                if(counterIndex !== -1) {
                    counter[counterIndex].tokenTimings = req.body.tokenTimings;
                    counter[counterIndex].currentDayTokensAvailable = req.body.currentDayTokensAvailable;
                    counter[counterIndex].maxTokenAvailable = req.body.currentDayTokensAvailable;
                    const updatedOrganization = await OrganizationSchema.findOneAndUpdate({_id: ID}, {services: services}, {new: true});
                    if(updatedOrganization) {
                        res.status(200).json({
                            message: 'Counter updated successfully'
                        });
                    } else {
                        res.status(500).json({
                            message: 'Error in updating counter'
                        });
                    }
                } else {
                    res.status(500).json({
                        message: 'Counter not found'
                    });
                }
            } else {
                res.status(500).json({
                    message: 'Service not found'
                });
            }
        } else {
            res.status(500).json({
                message: 'Error in getting services'
            });
        }
    }
});

/**
 *    Queue related operations
 */
router.post(INITIAL_URL + 'user/create/queue/:orgid/:serviceCode', async (req, res) => {
    // Validate the email and phone number (i.e email is valid and phone number is 10 digits string)
    const ID = req.params.orgid;
    const serviceCode = req.params.serviceCode;
    const userName = req.body.userName;
    const userPhone = req.body.userPhone;
    const userEmail = req.body.userEmail;
    const userGender = req.body.userGender;
    const userAge = req.body.userAge;
    const otherMembersName = req.body.otherMembersName;
    const otherMembersGender = req.body.otherMembersGender;
    if(ID.length !== 24) {
        res.status(500).json({
            message: 'Invalid ID'
        });
    }else if(userPhone.length !== 10 || !isNumeric(userPhone) || !isValidEmail(userEmail)) {
        res.status(500).json({
            message: 'Details are not valid'
        });
    }else{
        // Generate user id for that user
 
        // Save the details in the Users Database, Mail and SMS the user with the QR code

        // Set Session for the user

        // Push the userid in to the queue array of counter for that service in organization

        //Return the userid, qr and fetch the updated queue length from the counter array of service in organization
    }
    
});


/*  ----------------------------------------------------------------------------------------

        **********       Function to be used for the routes and api calls        **********

    ----------------------------------------------------------------------------------------
*/
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


// Function to check if the string contains numeric numbers
function isNumeric(str) {
    return /^\d+$/.test(str);
}

// Function to check if the string is a valid email
function isValidEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

// Function to generate unique user id for the queue
async function generateUserId(ID, serviceCode, users) {
        // Check for the counter for its availability status in the counter objects array
        // Also sums all the available token in the respective counter for particular service
        const organization = await OrganizationSchema.findById({_id: ID});
        const service = services.find(service => service.serviceCode === serviceCode);
        const counters = service.counter;
        let totalTokensAvailable = 0;
        

        // If (counter[i].currentDayTokensAvailable) >= (users.otherMembers.length + 1) 
        //then --> generate user id and return it with the respective
        // counter number and service code

        // If (counter[i].currentDayTokensAvailable) < (users.otherMembers.length + 1) 
        //then -->  check for the sum of all counter.currentDayTokensAvailable for that service
        // if the (sum) >= (users.otherMembers.length + 1) then --> generate user id and return it with the respective
        // counter number and service code

        // Else if (sum)  < (users.otherMembers.length + 1) then --> 
        //generate user id and return the user id with the respective counter number and service code along with 
        // message for the user that the counter will not be able to provide service to everymember

        // ETC .. cases for generating user id and assigning counter
        // User Id --> OrganizationCode + ServiceCode + CounterNumber + #UserNumber
        // for multple members with same user Id but that user id fills the queue array with the same user id 
        // contagiously

}

module.exports = router;