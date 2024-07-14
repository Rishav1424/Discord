const ws = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Message = require('./models/message');
const Channel = require('./models/channel');

module.exports = server => {
    const io = ws(server, {
        cors: {
            origin: "http://localhost:3000", // Replace with your React app's URL
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    const workspaces = io.of(/^\/\w+$/);
    workspaces.use(async (socket, next) => {
        const token = socket.handshake.auth.token?.replace('Bearer ', '');
        console.log(token, "ws");
        if (!token) return next();
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded.user;
            socket.user.username = (await User.findById(socket.user.id))?.username;
        } catch (err) {
            console.log(err);
        }
        next();
    });

    workspaces.on("connection", (socket) => {
        const workspace = socket.nsp;

        console.log(`${socket.user?.id} connected to ${workspace.name}`);

        socket.on("join", (cid) => {
            socket.join(`channel: ${cid}`);
            console.log(`${socket.user} joined ${cid}`);
        })

        socket.on("leave", (cid) => {
            socket.leave(`channel: ${cid}`);
            console.log(`${socket.user} left ${cid}`);
        })


        socket.on("message", async (content, cid) => {
            console.log(`got message from ${cid} : ${content}`);
            const message = new Message({
                content: content,
                sender: socket.user.id,
                channel: cid
            })
            const saved = await message.save();
            const channel = await Channel.findById(cid);
            channel.messages.push(saved._id);
            await channel.save();
            workspace.to(`channel: ${cid}`).emit("message", saved._id, content, socket.user.id, socket.user.username);
        })
    })
}