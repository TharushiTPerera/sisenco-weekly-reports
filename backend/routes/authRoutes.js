// This file defines the URLs (endpoints) related to login/register.

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
router.post('/register', register);
router.post('/login', login);

module.exports = router;