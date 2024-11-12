const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true},
    email: {
      type: String,
      required: true,
      validate: {
          validator: validator.isEmail,
          message: '{VALUE} is not a valid email. Please enter a valid email'
      },
      unique: true,
  },
    message: { type: String, required: true },
  }, {
    timestamps: true
});
  
module.exports = mongoose.model('Employee', userSchema);