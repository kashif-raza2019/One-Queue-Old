/*
 *@Author: Kashif Raza
 *@Date: 2022-04-06 
 *@Description: This is the server file for the application.
 *@github: https://www.github.com/kashif-raza2019/queue-management-sih-2022
 *Start: `npm start` or `nodemon server.js`
 */

// Importing the required modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Importing the user defined modules
const homeRoute = require('./routes/home');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const superAdminRoute = require('./routes/superadmin');

// Setting the port
const port = process.env.PORT || 3000;
// Setting the body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Setting Bootstrap and Font-Awesome
// Server will serve the static files
app.use('/bs/css', express.static(path.join(__dirname,'node_modules', 'bootstrap', 'dist', 'css' )));
app.use('/bs/css', express.static(path.join(__dirname,'node_modules', 'font-awesome', 'css' )));
app.use('/bs/js', express.static(path.join(__dirname,'node_modules', 'bootstrap', 'dist', 'js' )));
app.use('/jquery', express.static(path.join(__dirname,'node_modules', 'jquery', 'dist')));
app.use('/css', express.static(path.join(__dirname,'assets', 'css')));
app.use('/js', express.static(path.join(__dirname,'assets', 'js')));
app.use('/images', express.static(path.join(__dirname, 'assets', 'images')));

// Setting the routes
app.use(userRoute);
app.use(adminRoute);
app.use(superAdminRoute);
app.use(homeRoute);
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


// Starting the server
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

