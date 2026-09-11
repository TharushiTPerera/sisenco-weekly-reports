const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const requireManager = require('../middleware/requireManager');
const { register, login, getAllUsers, updateUserRole } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/users', requireAuth, requireManager, getAllUsers);
router.put('/users/:id/role', requireAuth, requireManager, updateUserRole);

module.exports = router;