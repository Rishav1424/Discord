const express = require('express');
const { getChannels, createChannel } = require('../controllers/channelController');
const router = express.Router();

router.route('/').get(getChannels).post(createChannel);

module.exports = router;