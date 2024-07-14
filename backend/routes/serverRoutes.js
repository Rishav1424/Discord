const express = require('express');
const { getServers, createServer, serverdetails } = require('../controllers/serverController');
const router = express.Router();

router.route('').get(getServers).post(createServer);
router.route('/:serverid').get(serverdetails);

module.exports = router;