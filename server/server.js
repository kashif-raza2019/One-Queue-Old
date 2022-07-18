const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// API Director
const API_DIRECTOR = require('./api/api_director');

// PORT for the server
const SERVER_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use( '/public' , express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/views/index.html');
});

app.use(API_DIRECTOR);


app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});