const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: {type: String, required: true},
  servers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }]
});

module.exports = mongoose.model('User', UserSchema);