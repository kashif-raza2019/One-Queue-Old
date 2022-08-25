const express = require('express');
const router = express.Router();
const Official = require('../../model/official');  
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const officialRegistrationTemplate = require('../../utils/officialMail/registration');
const SubofficialRegistrationTemplate = require('../../utils/officialMail/sub-department');
const sendEmail = require('../../utils/mail');
const INITIAL_URL = '/api/_v1/';
const session = require('express-session');
const cookieParser = require('cookie-parser');


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
 * @api {post} /api/_v1/official/create Create Official
 */
router.post(INITIAL_URL + 'official/create/', async (req, res) => {
    // Data to be strictly filled
    const username = req.body.username;
    // Temperory password create 8 letter string
    const password = createPassword(8);
    const hashedPassword = md5(password);
    const email = req.body.email;
    const district = req.body.district;
    const positionOfAuthority = req.body.positionOfAuthority;
    const address = req.body.address;
    const division = req.body.division;
    const contact = req.body.contact;

    if(!username || !password || !email || !district || !positionOfAuthority || !address || !division || !contact){
        res.status(400).send({
            message: 'Please fill all the fields'
        });
    }

    // Create 6 digit OTP
    let OTP = createOTP(6);
    // Check if official of the district is already created
    let official = await Official.findOne({district:district});
    if(official){
        res.status(400).send({
            message: 'Official of the district is already created'
        });
    }else{
        const newOfficial = new Official({
            username: username,
            password: hashedPassword,
            email: email,
            district: district,
            positionOfAuthority: positionOfAuthority,
            address: address,
            division: division,
            contact: contact,
            otp: OTP,
            tempPassword: true
        });
        const result = await newOfficial.save();
        if(result){
            if(sendEmail(email, "Official Registered Succesfully | One - Queue " + district, officialRegistrationTemplate(password))){
                res.status(200).json({
                    message: 'New Official Created',
                    result: result
                });
            }else{
                res.status(500).json({
                    message: 'Official registered but email not sent'
                });
            }
        }else{
            res.status(500).json({
                message: 'Error in creating new official'
            });
        }
    }

});

/**
 * 
 * @param {String} username
 * @param {String} password
 * @param {String} district
 * @returns Login official route
 */
router.post(INITIAL_URL + 'official/login/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const district = req.body.district;
    if(!username || !password || !district){
        res.status(400).send({
            message: 'Please fill all the fields'
        });
    }
    // Find official in the database
    const official = await Official.findOne({username:username, district:district});
    if(!official){
        res.status(400).send({
            message: 'Official not found'
        });
    }else{
        // Check if password is correct
    if(official.password === md5(password)){
        // Set session and jwttoken
        const jwtToken = jwt.sign({
            username: official.username,
            district: official.district
        }, process.env.SECRET, {
            expiresIn: '1h'
        });
        req.session.token = jwtToken;
        res.status(200).json({
            message: 'Login Successful',
            jwtToken: jwtToken
        });
    }else{
        res.status(400).send({
            message: 'Password is incorrect'
        });
    }
    }
    
});

/**
 * API for getting all the sub-department of the district if the official is logged in or session is present
 * @param {*} req
 * @returns 
 */
router.get(INITIAL_URL + 'official/sub-department/', async (req, res) => {
    const token = req.session.token;
    if(!token){
        res.status(400).send({
            message: 'Please login to get sub-department'
        });
    }else{
        const decoded = jwt.verify(token, process.env.SECRET);
        const district = decoded.district;
        const official = await Official.findOne({district:district});
        if(!official){
            res.status(400).send({
                message: 'Official not found'
            });
        }else{
            res.status(200).json({
                message: 'Sub-department found',
                subDepartment: official.subDepartments,
                numberOfSubDepartment: official.subDepartments.length
            });
        }
    }
})

/**
 * 
 * @param {*} Add Sub-departments
 * @returns 
 */
router.post(INITIAL_URL + 'official/add-sub-department/', async (req, res) => {
    const token = req.session.token;
    if(!token){
        res.status(400).send({
            message: 'Please login to add sub-department'
        });
    }else{
        const decoded = jwt.verify(token, process.env.SECRET);
        const district = decoded.district;
        const official = await Official.findOne({district:district});
        if(!official){
            res.status(400).send({
                message: 'Official not found'
            });
        }else{
            const subDepartmentName = req.body.name;
            const subDepartmentEmail = req.body.email;
            const subDepartmentContact = req.body.contact;
            const subDepartmentAddress = req.body.address;
            const subDepartmentPassword = req.body.password;
            const subDepartmentLocationCordinate = req.body.locationCordinate;
            const subDepartmentLocationName = req.body.locationName;
            const subDepartment = {
                name: subDepartmentName,
                email: subDepartmentEmail,
                contact: subDepartmentContact,
                address: subDepartmentAddress,
                password: subDepartmentPassword,
                locationCordinate: subDepartmentLocationCordinate,
                locationName: subDepartmentLocationName
            };
            official.subDepartments.push(subDepartment);
            const result = await official.save();
            if(result){
                let details = `<p>Name: <b>${subDepartmentName}</b></p><br>`;
                details += `<p>Email: <b>${subDepartmentEmail}</b></p><br>`;
                details += `<p>Contact: <b>${subDepartmentContact}</b></p><br>`;
                details += `<p>Address: <b>${subDepartmentAddress}</b></p><br>`;
                details += `<p>Password: <b>${subDepartmentPassword}</b></p><br>`;
                details += `<p>Location Name: <b>${subDepartmentLocationName}</b></p><br>`;
                details += `<p>Location Cordinate: <b>${subDepartmentLocationCordinate}</b></p><br>`;

                if(sendEmail(subDepartmentEmail, "Sub-department Registered Succesfully | One - Queue " + district, subDepartmentRegistrationTemplate(details))){
                    res.status(200).json({
                        message: 'Sub-department added',
                        result: result
                    });
                }else{
                    res.status(500).json({
                        message: 'Sub-department added but email not sent'
                    });
                }
            }else{
                res.status(500).json({
                    message: 'Error in adding sub-department'
                });
            }
        }
    }
});




// Create n digit OTP
function createOTP(size){
    var otp = "";
    for(var i = 0; i < size; i++){
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

function createPassword(size){
    var password = "";
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    for(var i = 0; i < size; i++){
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
}


// Secure the data by filtering unwanted input
function secureData(data){
    console.log(data.replace(/[^a-zA-Z0-9]/g, ' '));
    return data.replace(/[^a-zA-Z0-9]/g, '_');
}















module.exports = router;