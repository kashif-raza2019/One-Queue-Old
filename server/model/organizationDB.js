const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    // Organization Name
    name: String,
    // Organization Code is the unique identifier for the organization
    code: String,
    // id number of organization
    idNum:{type : Number, default: 1},
    // Organization Type is the type of organization
    type: String,
    // Organization Address is the address of the organization
    address: String,
    // Organization Phone is the phone number of the organization
    contact: String,
    // Organization Email is the email of the organization
    email: String,
    // Organization Password is the password of the organization
    password: String,
    // Organization Website is the website of the organization
    website: String,
    // Organization District is the district of the organization
    district: String,
    // Organization Division is the division of the organization
    division: {type: String, default: "None"},
    // Organization Description is the description of the organization
    description: String,
    // Organization created on time
    created: {type : Date, default: Date.now},
    // Organization logo
    logo: {data: Buffer, contentType: String},
    // Organization Status is the status of the organization
    activeStatus: { type: Boolean, default: false },
    // Organization created by is the user who created the organization
    createdBy: { type: String, default: "Unknown" },
    // Services are the array of objects that contains the services offered by the organization
    // Each service object has the following properties
    // Also the counter and queue details.
    services : { type:Object, default: [
        {
            serviceName: "MAIN",
            serviceCode: 1,
            role : ["admin", "editor", "viewer"],
            adminName : { type: String, default: "Unknown" },
            adminEmail : { type: String, default: "Unknown" },
            adminPhone : { type: String, default: "Unknown" },
            adminPassword : { type: String, default: "Unknown" },
            adminAlternateEmail : { type: String, default: "Unknown" },
            qrCode: {  data: Buffer, contentType: String },
            qrCodeImage: { data: Buffer, contentType: String },
            counter: {type: Object, default: [
                {
                    counterName: { type: String, default: "Counter - 01" },
                    counterNumber: { type: Number, default: 1 },
                    counterManager: { type: String, default: "Admin" },
                    // Token Timings Array Eve n Indices are starting time
                    // Odd Indices are ending time
                    tokenTimings: { type: Array, default: []},
                    counterStatus: { type: Boolean, default: false },
                    currentDayTokens: { type: Number, default: 0 },
                    // Maximum tokens for a day
                    maxTokenAvailable: { type: Number, default: 0 },
                    // Current token available == currentDayTokens - maxTokenForDay
                    // if currentDayToken == 0 currentDayTokenAvailable = maxTokenForDay
                    currentDayTokensAvailable: { type: Number, default: 0 },
                    previousDayTokens: { type: Number, default: 0 },
                    totalTokens: { type: Number, default: 0 },
                    trafficStatus: { type: String, default: "Low"},
                    // Traffic Status is the status of the counter 
                    // Low - Low Traffic (Green) Medium - Medium Traffic (Orange) High - High Traffic (Red)
                    trafficStatusColor: { type: String, default: "green"},
                    queues: { type: Array, default: []}
                }
            ]},
            canBeDeleted: {type: Boolean, default: false}
        }
    ] },
    // Organization approved by the official or not
    approvalStatus: { type: Boolean, default: false },
    // Id of the official who approved the organization
    approvedById: { type: String, default: "None" },
    // Organization approved on time
    approvedOn: { type: Date, default: 0000-00-00 },
    // Remarks of the official who approved the organization
    remarks: { type: String, default: "None" },
    // Documents Array to be uploaded
    documents: { type: Array, default: [] },
    // Organization's email address and phone number is verified
    authAndVerified: { type: Boolean, default: false },
    // Email verification link
    emailVerification: { type: String, default: "None" },
    // otp
    otp: { type: String, default: "None" },
    // Ratings of the organization
    rating: { type: Number, default: 2.5 }
});

module.exports = mongoose.model('Organization', OrganizationSchema);