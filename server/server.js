require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const _DB_CONNECTION = require('./controller/db_connect');
const {auth} = require('express-openid-connect');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// API Director
const API_DIRECTOR = require('./api/api_director');
const authRouter = require('./api/auth');
// PORT for the server
const SERVER_PORT = process.env.PORT || 8080;

// session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(cookieParser());

app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }
));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(auth({
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.SECRET,
//     issuerBaseURL: process.env.ISSUER_BASE_URL,
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET
// }));

app.use( '/public' , express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/Documentation', (req, res) => {
    res.sendFile(__dirname + '/views/api-documentation.html');
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