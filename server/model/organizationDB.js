const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    organizationName: String,
    // Organization Code is the unique identifier for the organization
    organizationCode: String,
    organizationType: String,
    organizationAddress: String,
    organizationPhone: String,
    organizationEmail: String,
    organizationPassword: String,
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
    numberOfAllowedTokens: { type: Number, default: 0 },
    currentTraffic: { type: Number, default: 0 },
    previousDayTraffic: { type: Number, default: 0 },
    //Traffic Status Color: Green - for less than 10% traffic, Yellow - for 10% to 50% traffic, Red - for more than 50% traffic
    trafficStatusColor: {type: String, default: "Green"},
    // ID of the current token
    currentTokenServed: { type: String, default: "None" },
    // ID of the previous token
    previousTokenServed: { type: String, default: "None" },
    // ID of the next token
    nextTokenServed: { type: String, default: "None" },
    // For verification purpose
    qrCodeUrl: { type: String, default: "None" },
    lastTimeActive: { type: Date, default: Date.now },
    // Rating of the organization
    rating: { type: Number, default: 2.5 },
    organizationApprovalStatus : { type: Boolean, default: false }
});

module.exports = mongoose.model('Organization', OrganizationSchema);