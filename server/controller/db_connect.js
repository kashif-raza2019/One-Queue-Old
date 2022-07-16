const mongoose = require('mongoose');
// Connect with  MongoDb Atlas
const DB_URI = 'mongodb+srv://queuemanagement2022:BUSiAySND1NdYHlF@queuecluster.syc7y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
const resp = mongoose.connection.readyState;
module.exports = {
    connection,
    resp
}