const express = require('express');
const router = express.Router();

router.use("/login", (req, res)=>{
    res.send("Welcome to the Org Login page");
});

router.post("/dashboard", (req, res)=>{
    res.send("Welcome to the Govt. Dashboard page");
});

module.exports = router;