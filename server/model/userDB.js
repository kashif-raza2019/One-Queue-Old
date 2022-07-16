const mongodb = require('./controller/db_connect');
const connection = mongodb.connection;
const mongoose = require('mongoose');
const Timestamp = require('bson').Timestamp;

const UserSchema = new mongoose.Schema({
    // Important to be filled before getting token
    userAge: Number,
    userEmail: {type: String, default: null},
    userContact: {type: String, default: null},
    userGender: {type: String, default: "Unknown"},
    userAdhaarNumber: {type: String, default: null},
    // Details that will automatically get filled by the system
    userName: String, 
    userTokenOrganizationId: String,
    organizationType: {type: String, default: "Unknown"},
    uniqueOneTimeCode: String,
    qrCodeUrl: String,
    tokenBoarded: {type: Boolean, default: false},

    // Details after getting served with token
    userAddress: {type: String, default: null},
    typeOfTokenQuery: {type: String, default: null},
    feedback: {type: String, default: null},
    serviceRating: {type: Number, default: null},

    // Token Informations
    userToken: Number,
    userTokenId: String,
    timeOfTokenServed: { type: Date, default: Date.now },
    // Being Served, Served
    userTokenStatus: {type: String, default: "Not Served"},
    userTokenStatusColor: {type: String, default: "Purple"},// Purple - for not served, Blue - You are next ,Green - for being served
    // For Future
    pushNotification: {type: Boolean, default: false},
    usersBeforeMe: {type: Number, default: 0},
});

module.exports = mongoose.model('User', UserSchema);