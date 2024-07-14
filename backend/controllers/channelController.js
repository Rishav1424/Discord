const Channel = require('../models/channel');

exports.getChannels = async (req, res) => {
  try {
    const channels = await Channel.find().populate('server');
    res.json(channels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createChannel = async (req, res) => {
  const channel = new Channel(req.body);
  try {
    const newChannel = await channel.save();
    res.status(201).json(newChannel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};