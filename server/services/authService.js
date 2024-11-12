const OTP = require('../model/otpModel');
const emailService = require('./emailService');

const OTP_EXPIRATION_TIME = 10 * 60 * 1000; 
const OTP_COOLDOWN_PERIOD = 10 * 60 * 1000;
const MAX_REQUESTS = 3;

const generateOTP = () => {
    const otpLength = 6;
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};


const requestOTP = async (email, name) => {
    const now = Date.now();
    let otpRecord = await OTP.findOne({ email });

    // Always generate a new OTP on each request
    const newOtp = generateOTP();

    if (otpRecord) {
        const isExpired = now - otpRecord.createdAt > OTP_EXPIRATION_TIME;

        // If OTP is expired, generate a new OTP and reset attempts
        if (isExpired) {
            otpRecord.otp = newOtp;
            otpRecord.createdAt = now;
            otpRecord.attempts = 1;  // Reset attempts to 1 as the OTP is fresh
        } 
        // If OTP is not expired and max attempts are reached, return early
        else if (otpRecord.attempts >= MAX_REQUESTS) {
            return { maxOtpReached: true };
        } 
        // If OTP is not expired, increment the attempts
        else {
            otpRecord.otp = newOtp;  // Update OTP on every request
            otpRecord.attempts += 1;
        }
    } else {
        // If no OTP record exists, create a new one with the first attempt
        otpRecord = new OTP({
            name,
            email,
            otp: newOtp,
            attempts: 1,
            createdAt: now
        });
    }
    await otpRecord.save();

    const emailSubject = 'OTP to Verify Your Email to Schedule a Demo with MinutesVault';
    const mailData = `<p><p>Dear ${otpRecord.name}, <br><br>
      Thank you for your interest in scheduling a demo. Your OTP is <strong>${otpRecord.otp}</strong>. It will expire in 10 minutes.</p> `;
    await emailService.sendMail(email, emailSubject, mailData);

    return { otp: otpRecord.otp, attempts: otpRecord.attempts, otpSent: true };
};

const verifyOTP = async (email, otp) => {
    try {
        const otpRecord = await OTP.findOne({ email });
        const currentTime = Date.now();

        // if (!otpRecord || otpRecord.isVerified) {
        //     return { notVerified: true };
        // }

        if (currentTime - otpRecord.createdAt > OTP_EXPIRATION_TIME) {
            await OTP.deleteOne({ email }); 
            return { OtpExpired: true };
        }

        if (otpRecord.isVerified) {
            if (currentTime - otpRecord.verifiedAt < OTP_COOLDOWN_PERIOD) {
                return { alreadyVerified: true };
            }
        }
        if (otpRecord.otp !== otp) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            return { invalidOtp: true, attemptsRemaining: MAX_REQUESTS - otpRecord.attempts };
        }
        otpRecord.isVerified = true;
        otpRecord.verifiedAt = currentTime;
        await otpRecord.save();
        return { verified: true };

    } catch (error) {
        console.error("Error in OTP verification:", error);
        return { error: error.message };
    }
};



module.exports = {
    requestOTP,
    verifyOTP
};
