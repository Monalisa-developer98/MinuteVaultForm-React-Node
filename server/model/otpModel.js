const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    name: {
        type:String,
        index: true,
    },
    email: {
        type:String,
        required:true,
    },
    otp: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: { type: Date },
    attempts: {
        type: Number,
        default: 0
    },  
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 600 // 10 minutes
    }
},{
    timestamps: true
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP