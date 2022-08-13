const { json } = require('body-parser');
const express = require('express');
const ROUTER = express.Router();
const INITIAL_URL = '/api/_v1/';
const qrcode = require('qrcode');



ROUTER.get(INITIAL_URL + 'generate/qr-code/organization/:organizationId/:size', (req, res) => {
    const qrId = req.params.organizationId;
    const size = req.params.size;
    qrcode.toDataURL(qrId, function (err, url) {
        if (err) throw err;
        // console.log(url);
        res.send("<div style='background-color: #CCCCCC;'><img src='" + url + "' style='height: " + size + "; width: " + size + " ; color: #78C0BC' /></div>");
    });
});

module.exports = ROUTER;