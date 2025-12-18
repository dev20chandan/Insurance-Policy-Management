// src/models/Policy.js
const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    policyNumber: { type: String },
    policyStartDate: Date,
    policyEndDate: Date,
    policyType: String,
    policyMode: String,

    premiumAmount: Number,
    premiumAmountWritten: Number,

    producer: String,
    csr: String,

    hasActivePolicy: Boolean,

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    lobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LOB'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrier'
    }
});

module.exports = mongoose.model('Policy', PolicySchema);
