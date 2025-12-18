const mongoose = require('mongoose');

const CarrierSchema = new mongoose.Schema(
  {
     company_name: {
      type: String,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Carrier', CarrierSchema);
