const http = require('http');
const express = require('express');
const ws = require('./ws.js');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken')
const cors = require('cors')

dotenv.config();

const app = express();

const server = http.createServer(app);

// Connect Database
connectDB();

//connect websocket
ws(server);

//handle cors
app.use(cors());

// Middleware to parse into json
app.use(express.json());

// Middleware to authenticate
app.use((req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if(!token) return next();
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
    }catch(err){
        console.log(err);
    }
    next();
})

//Middleware to print request info
app.use((req, res, next) => {
    console.log(`${req.method} request at ${req.path} by ${req.user}`);
    console.log(req.user);
    next();
})

// // Define Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/server', require('./routes/serverRoutes'));
app.use('/channels', require('./routes/channelRoutes'));
app.use('/messages', require('./routes/messageRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));