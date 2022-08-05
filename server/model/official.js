const mongoose = require('mongoose');

const officialSchema = new mongoose.Schema({
    name : String,
    username : String,
    mobile: String,
    adhaar: String,
    position: String,
    authorizationDocuments: Blob,
    
});