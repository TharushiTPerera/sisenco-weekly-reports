// This file defines the URLs (endpoints) related to login/register.

const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');

router.post('/register', register);

module.exports = router;