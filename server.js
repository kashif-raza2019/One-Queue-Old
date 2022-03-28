const express = require('express');
const app = express();


const portNumber = process.env.PORT || 3000;


app.get('/api/v1/', (req, res) => {
    let resp = `<h1>Welcome to Port ${portNumber}</h1>`;
    resp += '<h2>API Routes</h2>';
    resp += '<ul>';
    resp += '<li>/api/v1/</li>';
    resp += '<li>/api/v1/token</li>';
    resp += '<li>/api/v1/token/:tokenId</li>';
    resp += '</ul>';

    res.send(resp);
});

// Index
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/src/index.html');
});

// One-Click Token
app.get('/gettoken', (req, res) => {
    res.sendFile(__dirname + '/app/src/oneclicktoken.html');
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

app.get('/example', (req, res) => {
    res.sendFile(__dirname + '/app/src/example.html');
});

 app.listen(portNumber, () => {
        console.log(`Server is running on port ${portNumber}`);
});
