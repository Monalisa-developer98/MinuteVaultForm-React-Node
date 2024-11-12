const Employee = require('../model/userModel');
const OTP = require('../model/otpModel');


const createUser = async (data) => {
    try {
        const otpRecord = await OTP.findOne({ email: data.email });
        if (!otpRecord || !otpRecord.isVerified) {
            return { error: true, success: false, notVerified: true };
        }
         const inputData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
        };
        const newEmployee = new Employee(inputData);
        await newEmployee.save();

        return {
            success: true,
            data: newEmployee,
        };
    } catch (error) {
        console.error(error);
        return { error: true, success: false, message: error.message };
    }
};


module.exports = {
    createUser
}