const express = require('express');
const { register, login, updatePassword, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/update-password', verifyToken, updatePassword);
router.post('/logout', verifyToken, logout);

module.exports = router;
