const express = require('express');
const path = require('path');
const router = express.Router();

router.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, '../' , 'views', 'index.html'));
});

router.use("/directorylist", (req, res)=>{
    res.sendFile(path.join(__dirname, '../' , 'views', 'dir.htm'));
});

router.use("/scanner", (req, res)=>{
    res.sendFile(path.join(__dirname, '../' , 'views', 'scanqr.html'));
});

module.exports = router;