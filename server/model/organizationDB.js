const mongodb = require('../controller/db_connect');
const mongoose = require('mongoose');
const Timestamp = require('bson').Timestamp;

const organizationSchema = new mongoose.Schema({
    organizationName: String,
    // Organization Code is the unique identifier for the organization
    organizationCode: String,
    organizationType: String,
    organizationAddress: String,
    organizationPhone: String,
    organizationEmail: String,
    organizationWebsite: String,
    organizationDistrict: String,
    organizationDivision: String,
    organizationLogo: String,
    organizationDescription: String,
    organizationCreated: {type : Date, default: Date.now},
    organizationLogo: {data: Buffer, contentType: String},
    activeStatus: { type: Boolean, default: false },
    createdBy: { type: String, default: "Unknown" },
    
    // Details to be added later
    numberOfAllowedTokens: Number,
    currentTraffic: Number,
    previousDayTraffic: Number,
    //Traffic Status Color: Green - for less than 10% traffic, Yellow - for 10% to 50% traffic, Red - for more than 50% traffic
    trafficStatusColor: {type: String, default: "Green"},
    // ID of the current token
    currentTokenServed: String,
    // ID of the previous token
    previousTokenServed: String,
    // ID of the next token
    nextTokenServed: String,
    // For verification purpose
    qrCodeUrl: String,
    lastTimeActive: { type: Date, default: Date.now },
    // Rating of the organization
    rating: { type: Number, default: 2.5 }
});

module.exports = mongoose.model('Organization', organizationSchema);