const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
  {
    accountName: {
      type: String,
      required: true,
      index: true
    },
    accountType: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', AccountSchema);
