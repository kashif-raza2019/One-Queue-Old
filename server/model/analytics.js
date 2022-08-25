const mongoose = require('mongoose');

const Analytics = new mongoose.Schema({
    // Organization Id
    organizationId: String,
    // Organization Code
    organizationCode: String,
    // Organization Name
    organizationName: String,
    // Service Name
    serviceName: String,
    // service id
    serviceId: String,
    // Organization District
    organizationDistrict: String,
    // Official ID
    officialId: String,
    // Date of Anaylitics
    date: Date,
    // Number of Queues
    numberOfQueues: Number,
    // Total Female
    femaleCount : Number,
    // Male Count
    maleCount: Number,
    // Feedbacks 
    feedback : Array,
    // Ratings by users
    ratings: Array
});


module.exports = mongoose.model('Analytics', Analytics);