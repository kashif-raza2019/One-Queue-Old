const express = require('express');
const ROUTER = express.Router();
const INITIAL_URL = '/api/_v1/';


const rajasthanJson = require('../../utils/rajasthan.json');

ROUTER.get(INITIAL_URL + 'District/:district', (req, res) => {
    let district = req.params.district;
    district[0] = district[0].toUpperCase();
    if(getDistrict(district)) {
        res.json({
            "status": "success",
            "data": {
                "district": district
            }});
    }
    else {
        res.status(404).json({
            "status": "failure",
            "data": {
                "message": "District not found"
            }
        });
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

module.exports = ROUTER;