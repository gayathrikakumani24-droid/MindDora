const express = require('express');
const router = express.Router();
const { queryChat } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, queryChat);

module.exports = router;
