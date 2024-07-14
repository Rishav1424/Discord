const Channel = require('../models/channel');
const Message = require('../models/message');
const User = require('../models/user');

exports.getMessages = async (req, res) => {
    try {
        const channelid = req.params.cid;

        const { messages } = await Channel.findById(channelid);

        Promise.all(
            messages.map(async (id) => {
                const obj = {};
                const message = await Message.findById(id);
                obj.id = id;
                obj.content = message.content;
                obj.senderId = message.sender;
                obj.senderUsername = (await User.findById(message.sender))?.username;
                return obj;
            })
        ).then((obj) => { res.json(obj) });

    } catch (err) {

    }
}