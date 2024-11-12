const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: `${process.env.USER_MAIL}`,
        pass: `${process.env.USER_PASS}`,
    }
});

const mailOptions = {
    from: `${process.env.USER_MAIL}`,
    to: '',
    subject: 'OTP to Verify Your Email to Schedule a Demo',
    html: 'Thank you for your interest.'
}

module.exports = {
    transporter, mailOptions
}