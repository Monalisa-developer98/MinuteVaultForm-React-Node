const otpSentSuccess = (email) => `A 6 digit OTP has been sent to ${email}.`;
const invalidOtp = 'Wrong OTP. Please try again.';
const otpVerifiedSuccess = 'Your OTP has been verified successfully';
const maxOtpReached = 'Maximum OTP requests reached. Please wait for 10 minutes until the OTP expires.'
const otpExpired = 'OTP has expired.'
const incompleteVerification = 'Incomplete Verification'
const formSubmit = 'Your form has been submitted successfully.'
const alreadyVerified = 'This email is already verified. Please try again after 10 minutes.'
const notVerified = 'Please verify the OTP before submitting.'

module.exports = {
    otpSentSuccess,
    invalidOtp,
    otpVerifiedSuccess, 
    maxOtpReached,
    otpExpired,
    incompleteVerification,
    formSubmit,
    alreadyVerified,
    notVerified
}