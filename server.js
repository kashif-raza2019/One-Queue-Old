const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const io = new Server(server);
const portNumber = process.env.PORT || 3000;
app.use(express.static(__dirname));

const time = 60*60*1000;
//username and password
const myusername = 'medanta';
const mypassword = 'pass1234';

// a variable to save a session
var session;
app.use(sessions({
    secret: "thisisasecreat",
    saveUninitialized:true,
    cookie: { maxAge: time },
    resave: false
}));

app.get('/orglogin',(req,res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
    res.sendFile(__dirname + '/app/src/orglogin.html');
});

app.post('/orgAdmin',(req,res) => {
    if(req.body.username == myusername && req.body.password == mypassword){
        session=req.session;
        session.userid=req.body.username;
        console.log(req.session)
        res.sendFile(__dirname + '/app/src/admin.html');
    }
    else{
        res.send('Invalid username or password');
    }
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/orglogin');
});


app.get('/api/v1/', (req, res) => {
    let resp = {
        message: 'Welcome to the API',
        status: 200,
        routes:   {
            '/api/v1/': 'Home',
            '/api/v1/users': 'Users',
            '/api/v1/users/:id': 'User',
            '/api/v1/users/:id/tokens': 'User Tokens',
            '/api/v1/users/:id/tokens/:token': 'User Token'
        }};
    res.send(resp);
});
// Images
app.get('/api/v1/images/:image', (req, res) => {
    let image = req.params.image;
    res.sendFile(__dirname + '/app/src/assets/images/' + image);
});
// scanner api
app.get('/api/v1/js/scanner', (req, res) => {
    res.sendFile(__dirname + '/app/src/assets/js/scanner.js');
});





// Index
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/src/index.html');
});

app.get('/registertoken', (req, res)=> {
    
});

//Token Details
app.get('/tokenDetails', (req, res) => {
    res.sendFile(__dirname + '/app/src/tokenDetails.html');
});

// Admin / Registration
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/app/src/admin.html');
});

// Token-feedback
app.get('/token-feedback', (req, res) => {
    res.sendFile(__dirname + '/app/src/token-feedback.html');
});

// organization
app.get('/organization', (req, res) => {
    res.sendFile(__dirname + '/app/src/organization.html');
});
// view organization qr code
app.get('/viewqr', (req, res) => {
    res.sendFile(__dirname + '/app/src/viewqr.html');
});


// Example API
app.get('/example', (req, res) => {
    res.sendFile(__dirname + '/app/src/example.html');
});

app.get('/exampletoken', (req, res) => {
    res.sendFile(__dirname + '/app/src/exampletoken.html');
});

app.get('/exampletokenverified', (req, res) => {
    res.sendFile(__dirname + '/app/src/exampletokenverified.html');
});

app.get('/scanqr', (req, res) => {
    res.sendFile(__dirname + '/app/src/scanqr.html');
});

app.get('/dir', (req, res)=>{
    res.sendFile(__dirname + '/resources/dir.htm');
});


 app.listen(portNumber, () => {
        console.log(`Server is running on port ${portNumber}`);
})

