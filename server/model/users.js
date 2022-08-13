const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // User Name
    name: String,
    // User's Adhaar Number
    adhaarNumber: {type: String, default: "Unknown"},
    // Gender
    gender: String,
    // Age
    age: Number,
    // User Email Address
    email: String,
    // User Phone Number
    phone: String,
    // Other members
    otherMembers: { type: Array, default: [] },
    // other members age
    otherMembersAge: { type: Array, default: [] },
    // other members gender
    otherMembersGender: { type: Array, default: [] },
    // Other Members allow status
    otherMembersStatus: { type: Boolean, default: false },

    // QR Code
    qrcode: String,
    // User token code
    userTokenCode: String,
    // User's registered organization
    organization: {type: String, default: "Unknown"},
    // service from organization
    services: String,
    // Counter Number
    counter: Number,
    // Counter Name
    counterName: String,
    // Token number
    tokenNumber: {type: Number, default: 0},
    // Token boarded status
    tokenBoarded: {type: Boolean, default: false},
    // Token status
    tokenStatus: {type: String, default: "Not Served"},
    // Token status color
    // Purple - for not served, Blue - You are next ,Green - for being served
    tokenStatusColor: {type: String, default: "Purple"},
    // One Time Password
    otp: String,
    // User authorized status
    authorized: { type: Boolean, default: false },
    // Is it an emergency user
    emergency: { type: Boolean, default: false },
    // Push Notification allowed status
    pushNotification: { type: Boolean, default: false },
    // User created on time
    created: {type : Date, default: Date.now}
});


module.exports = mongoose.model('User', UserSchema);