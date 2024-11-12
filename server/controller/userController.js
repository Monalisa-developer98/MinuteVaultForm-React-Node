const authService = require('../services/authService');
const userService = require('../services/userService');
const Responses = require('../helpers/response');
const messages = require('../constants/constMessages');

const requestOtp = async (req, res) => {
    try {
        const { email, name } = req.body; 
        const result = await authService.requestOTP(email, name);
        if (result.maxOtpReached) {
            return Responses.failResponse(req, res, null, messages.maxOtpReached, 429);
        }
        const successMessage = messages.otpSentSuccess(email);
        return Responses.successResponse(req, res, result, successMessage, 201);
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, error);
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body; 
        const result = await authService.verifyOTP(email, otp);
        
        if (result.OtpExpired) {
            return Responses.failResponse(req, res, null, messages.otpExpired, 400);
        }

        if (result?.invalidOtp) {
            return Responses.failResponse(req, res, null, messages.invalidOtp, 400);
        }
        if (result.alreadyVerified) {
            return Responses.failResponse(req, res, null, messages.alreadyVerified, 400);
        }
        return Responses.successResponse(req, res, result, messages.otpVerifiedSuccess, 200);
    } catch (error) {
        console.log(error);
        return Responses.errorResponse(req, res, error);
    }
};

const createUser = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        if (result?.notVerified) {
            return Responses.failResponse(req, res, null, messages.notVerified, 400);
        }
        if (!result.success) {
            const message = result.message || "Incomplete verification. Please verify OTP.";
            return Responses.failResponse(req, res, null, message, 400);
        }

        return Responses.successResponse(req, res, result.data, messages.formSubmit, 201);
    } catch (error) {
        console.error(error);
        return Responses.errorResponse(req, res, { message: error.message });
    }
};


module.exports = {
    requestOtp, verifyOtp, createUser
}