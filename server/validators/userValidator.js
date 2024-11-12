const Joi = require('joi');
const Responses = require('../helpers/response');

// Validator for request OTP
const requestOtpValidator = async (req, res, next) => {
    try {
        const otpSchema = Joi.object({
            email: Joi.string().email().required().messages({
                'string.email': 'Email must be a valid email address.',
                'string.empty': 'Email is required.',
                'any.required': 'Email is required.'
            }),
            name: Joi.string().required().messages({
                'string.empty': 'Name is required.',
                'any.required': 'Name is required.'
            })
        })

        await otpSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        const errorMessages = error.details.map(err => err.message).join(', ');
        console.log(errorMessages);
        return Responses.errorResponse(req, res, "Validation Error: " + errorMessages, 400);
    }
};

// Validator for verifying OTP
const verifyOtpValidator = async (req, res, next) => {
    try {
        const otpSchema = Joi.object({
            email: Joi.string().email().required().messages({
                'string.email': 'Email must be a valid email address.',
                'string.empty': 'Email is required.',
                'any.required': 'Email is required.'
            }),
            otp: Joi.string().pattern(/^[0-9]+$/).required().messages({
                'string.pattern.base': 'OTP must be numeric.',
                'string.empty': 'OTP is required.',
                'any.required': 'OTP is required.'
            })
        });
        await otpSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        const errorMessages = error.details.map(err => err.message).join(', ');
        console.log(errorMessages);
        return Responses.errorResponse(req, res, "Validation Error: " + errorMessages, 400);
    }
};

const createUserValidator = async (req, res, next) => {
    try {
        const bodySchema = Joi.object({
            name: Joi.string()
                .pattern(/^[a-zA-Z\s]+$/)
                .min(3)
                .required()
                .messages({
                    'string.pattern.base': 'Name must only contain letters and spaces.',
                    'string.empty': 'Name is required.',
                    'any.required': 'Name is required.',
                    'string.min': 'Name must be at least {#limit} characters long.'
                }),
            phone: Joi.string()
                .pattern(/^[0-9]{10}$/) 
                .length(10)            
                .required()
                .messages({
                    'string.pattern.base': 'Phone number must only contain exactly 10 digits.',
                    'string.empty': 'Phone number is required.',
                    'any.required': 'Phone number is required.',
                    'string.length': 'Phone number must be exactly {#limit} digits long.'
                }),
            email: Joi.string().email().required()
                .messages({
                    'string.email': 'Email must be a valid email address.',
                    'string.empty': 'Email is required.',
                    'any.required': 'Email is required.',
                }),
            message: Joi.string()
        });

        await bodySchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        const errorMessages = error.details.map(err => err.message).join(', ');
        console.error(errorMessages);
        return Responses.errorResponse(req, res, "Validation Error: " + errorMessages, 400);
    }
};

module.exports = {
    requestOtpValidator,
    verifyOtpValidator,
    createUserValidator
};