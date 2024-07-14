const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, },
  channels: {type:Map, of:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }]},
  owner : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Server', ServerSchema);