
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    content: { type: String },
    media: { type: Boolean, default: false },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);