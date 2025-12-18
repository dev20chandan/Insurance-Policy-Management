// models/Agent.js
const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  agentName: String
});

module.exports = mongoose.model('Agent', AgentSchema);
