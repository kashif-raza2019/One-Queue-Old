const express = require('express');
const app = express();

const portNumber = process.env.PORT || 3000;

// API Route 
app.get('/api/v1/', (req, res) => {
    let htmlCode = `<h1>Welcome to Port ${portNumber}</h1>`;
 
    res.send(htmlCode);
 
 });

 app.listen(portNumber, () => {
        console.log(`Server is running on port ${portNumber}`);
    }
);
