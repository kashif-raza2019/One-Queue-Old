const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const _DB_CONNECTION = require('./controller/db_connect');
// API Director
const API_DIRECTOR = require('./api/api_director');

// PORT for the server
const SERVER_PORT = process.env.PORT || 8080;

app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use( '/public' , express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/views/index.html');
});

app.use(API_DIRECTOR);


app.listen(SERVER_PORT, () => {
    _DB_CONNECTION.connection.on('connected', () => {
        console.log(`Mongoose is connected to MongoDb Atlas`);
    });
    _DB_CONNECTION.connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err}`);
    });
    console.log(`Server is running on port ${SERVER_PORT}`);
});