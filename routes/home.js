const express = require('express');
const path = require('path');
const router = express.Router();

router.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, '../' , 'views', 'index.html'));
});

router.use("/example", (req, res)=>{
    res.sendFile(path.join(__dirname, '../' , 'views', 'Example' ,'example.html'));
});

router.use("/exampleverified", (req, res)=>{
    res.sendFile(path.join(__dirname, '../' , 'views', 'Example' ,'exampletokenverified.html'));
});

router.use("/directorylist", (req, res)=>{
    res.sendFile(path.join(__dirname, '../' , 'views', 'dir.htm'));
});

router.use("/scanner", (req, res)=>{
    res.sendFile(path.join(__dirname, '../' , 'views', 'scanqr.html'));
});

router.use("/login", (req, res)=>{
    res.sendFile(path.join(__dirname, '../' , 'views', 'loginform.html'));
});

module.exports = router;