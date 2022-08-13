require('dotenv').config();
const mongoose = require('mongoose');
// Connect with  MongoDb Atlas
const DB_URI = 'mongodb+srv://'+ process.env.DB_USERNAME +':' + process.env.DB_PASSWORD +'@onequeue.9hdfu.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
const resp = mongoose.connection.readyState;
module.exports = {
    connection,
    resp
}