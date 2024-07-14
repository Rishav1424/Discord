const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  topic: { type: String },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  messages: [{type:mongoose.Schema.Types.ObjectId, ref: 'Message'}],
});

module.exports = mongoose.model('Channel', ChannelSchema);