const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticationService = require('../services/authentication-service');

const { API_URL, PORT, ERROR_MESSAGES, STATUS_CODES, JWT_SECRET } = require('../app-modules/constants');


router.post('/login', async (req, res) => {

    try {
       await authenticationService.doLogin(req, res);
    } catch (err) {

        console.log(err)

        if (err.message == 'Username or password is required') {
            res.status(400).json({ message: err.message });
        } else if (err.message == 'Invalid username or password') {
            res.status(401).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

router.post('/refreshtoken', async (req, res) => {

    

    try {
        await authenticationService.doRefreshToken(req, res);
     } catch (err) {

        console.log(err);
 
         if (err.message == 'Username or password is required') {
             res.status(400).json({ message: err.message });
         } else if (err.message == 'Invalid request. Login again') {
             res.status(401).json({ message: err.message });
         } else {
             res.status(500).json({ message: "Internal server error" });
         }
     }
});

module.exports = router;
