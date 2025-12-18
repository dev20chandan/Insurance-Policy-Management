const { default: mongoose } = require("mongoose");

const MessageSchema = new mongoose.Schema({
  message: String,
  executeAt: Date,
  executed:{type:Boolean , default:false}
});

module.exports = mongoose.model('Message', MessageSchema);