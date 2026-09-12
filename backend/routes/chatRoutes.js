const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const requireManager = require('../middleware/requireManager');
const { askAssistant } = require('../controllers/chatController');

router.post('/ask', requireAuth, requireManager, askAssistant);

module.exports = router;