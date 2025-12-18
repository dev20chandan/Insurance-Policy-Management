const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: String,
    dob: Date,
    email: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    phoneNumber: String,
    gender: String,
    userType: String,
    primaryApplicant: Boolean,
    applicantId: String
});

module.exports = mongoose.model('User', UserSchema);
