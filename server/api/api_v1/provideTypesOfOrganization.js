const express = require('express');
const router = express.Router();
const typesOfOrganizationSchema = require('../../model/typesOfOrganization');
const INITIAL_URL = '/api/_v1/';
// const TypesOfOrganization = require('../../model/typesOfOrganization');

let typesOfOrganizationTest = Array('Hostipal', 'School', 'College', 'University', 'Other');

router.get(INITIAL_URL + 'types/organization', async (req, res) =>{
    // const typesOfOrganization = await TypesOfOrganization.find({ "_id" : "62ecfa8127260af476763641"});
    // Send Json of only organizationType not Id
    res.json(typesOfOrganizationTest);
});

router.post(INITIAL_URL + 'types/organization/:newType', async (req, res) =>{
//     let newTypeOfOrganization = req.body.typeOfOrganization;
//     // Push this new type of organization to the already filled database
//     const typesOfOrganization = await TypesOfOrganization.find({ "_id" : "62ecfa8127260af476763641"});
//     const arrayOfOrganization = typesOfOrganization[0].organizationType;
//     typesOfOrganization[0].save();
//     res.json(typesOfOrganization[0].organizationType);
        // const {typeOfOrganization} = req.body;
        typesOfOrganizationTest.push(req.params.newType);
        // console.log(typesOfOrganizationTest);
        res.json(typesOfOrganizationTest);
});

module.exports = router;