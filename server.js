const express = require('express');
const app = express();

const portNumber = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.sendFile(__dirname + './app/src/index.html');
});


// API Route 
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

 app.listen(portNumber, () => {
        console.log(`Server is running on port ${portNumber}`);
    }
);
