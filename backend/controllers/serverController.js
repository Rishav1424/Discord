const Server = require('../models/server');
const User = require('../models/user');
const Channel = require('../models/channel');

exports.getServers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.servers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createServer = async (req, res) => {
  const server = new Server(req.body);
  try {
    const newServer = await server.save();
    res.status(201).json(newServer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.serverdetails = async (req, res) => {
  const serverid = req.params.serverid;
  try {
    const server = await Server.findById(serverid);
    const obj = JSON.parse(JSON.stringify(server));

    await Promise.all(
      Object.entries(obj.channel).map(async ([tag, ids]) => {
        obj.channel[tag] = await Promise.all(
          ids.map(async (id) => {
            return await Channel.findById(id);
          })
        )
      })
    )
    res.json(obj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}