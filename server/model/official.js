const mongoose = require('mongoose');

const officialSchema = new mongoose.Schema({
    // Official Name
    name : String,
    // Username is the unique identifier for the official
    username : String,
    // Email is the email of the official
    email: String,
    // Alternate Email is the alternate email of the official
    alternateEmail: String,
    // Password
    password: String,
    // Phone is the phone number of the official
    phone: String,
    // position of authority of the official
    positionOfAuthority: String,
    // sub-departments created by the official
    subDepartments: { type: Array, default: [] },
    // List of documents uploaded by the official
    documents: {type: Array, default: []},
    // Authorized status of the official
    authorized: { type: Boolean, default: false },
    // District of the official
    district: String,
    // Division of the official
    division: String,
    // Address of the official
    address: String,
    // Created on time of the official
    created: {type : Date, default: Date.now}
});

module.exports = mongoose.model('Official', officialSchema);