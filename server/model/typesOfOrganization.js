const mongoose = require('mongoose');

const typesOfOrganizationSchema = new mongoose.Schema({
    // Array of Strings
    organizationType: {type: Array, default: []},
});

module.exports = mongoose.model('TypesOfOrganization', typesOfOrganizationSchema);