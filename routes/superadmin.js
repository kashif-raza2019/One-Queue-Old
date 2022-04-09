const express = require('express');
const router = express.Router();


router.post("/dashboard", (req, res)=>{
    res.send("Welcome to the Govt. Dashboard page");
});

module.exports = router;