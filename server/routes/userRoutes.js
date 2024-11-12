const express = require('express');
const router = express.Router();
const authController = require('../controller/userController');
const validator = require('../validators/userValidator');

//request otp
router.post('/request-otp', validator.requestOtpValidator, authController.requestOtp);

//verify otp
router.post('/verify-otp', validator.verifyOtpValidator, authController.verifyOtp);

// create user
router.post('/create-user', validator.createUserValidator, authController.createUser)

module.exports = router;