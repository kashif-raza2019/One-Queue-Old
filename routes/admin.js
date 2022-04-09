const express = require('express');
const router = express.Router();

router.use("/adminlogin", (req, res)=>{
    res.send("Welcome to the Admin Login page");
});

router.post("/admin-panel", (req, res)=>{
    res.send("Welcome to the Admin Panel page");
});

router.get("/chatadmin", (req, res)=>{
    res.send("Welcome to the Admin - Government Chat page");
});

module.exports = router;