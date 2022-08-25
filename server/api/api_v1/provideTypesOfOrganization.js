const express = require('express');
const router = express.Router();
const typesOfOrganizationSchema = require('../../model/typesOfOrganization');
const INITIAL_URL = '/api/_v1/';
// const TypesOfOrganization = require('../../model/typesOfOrganization');

// let typesOfOrganizationTest = Array('Hostipal', 'School', 'College', 'University', 'Other');

router.get(INITIAL_URL + 'types/organization/', async (req, res) =>{
    const typesOfOrganization = await typesOfOrganizationSchema.findById({ "_id" : "62ecfa8127260af476763641"});
    // Send Json of only organizationType not Id
    res.json({types : typesOfOrganization.organizationType});
});

router.post(INITIAL_URL + 'types/organization/', async (req, res) =>{
    const newTypeOfOrganization = req.body.typeOfOrganization;
    // Push this new type of organization to the already filled database
    const typesOfOrganization = await typesOfOrganizationSchema.findById({ "_id" : "62ecfa8127260af476763641"});
    let typesOfOrganizationArray = typesOfOrganization.organizationType;
    // Check if this type of organization is already present in the database
    if(typesOfOrganizationArray.includes(newTypeOfOrganization)){
        res.json({
            "message" : "Type of organization already present in the database"
        });
    }
    else{
            typesOfOrganizationArray.push(newTypeOfOrganization);

            // Update the database with the new type of organization
            const updatedData = await typesOfOrganizationSchema.findOneAndUpdate({ _id : "62ecfa8127260af476763641"}, {organizationType: typesOfOrganizationArray}, {new: true});
            if(updatedData){
                res.status(200).json({
                    message: 'Type of organization added successfully',
                    status: 200
                });
            }else{
                res.status(400).json({
                    message: "Unable to add type of organization",
                    status: 400
                }); 
            }
    }
});

// Delete a type of organization from the database
router.delete(INITIAL_URL + 'types/organization/', async (req, res) =>{
    const typeOfOrganizationToDelete = req.body.typeOfOrganization;
    const typesOfOrganization = await typesOfOrganizationSchema.findById({ "_id" : "62ecfa8127260af476763641"});
    let typesOfOrganizationArray = typesOfOrganization.organizationType;
    // Check if this type of organization is already present in the database
    if(typesOfOrganizationArray.includes(typeOfOrganizationToDelete)){
        typesOfOrganizationArray.splice(typesOfOrganizationArray.indexOf(typeOfOrganizationToDelete), 1);
        // Update the database with the new type of organization
        const updatedData = await typesOfOrganizationSchema.findOneAndUpdate({ _id : "62ecfa8127260af476763641"}, {organizationType: typesOfOrganizationArray}, {new: true});
        if(updatedData){
            res.status(200).json({
                message: 'Type of organization deleted successfully',
                status: 200
            });
        }else{
            res.status(400).json({
                message: "Unable to delete type of organization",
                status: 400
            }); 
        }
    }
    else{
        res.json({
            "message" : "Type of organization not present in the database"
        });
    }
});

module.exports = router;