const express = require('express');
const { getMessages } = require('../controllers/messageController.js');
const router = express.Router();

router.route('/:cid').get(getMessages);

module.exports = router;