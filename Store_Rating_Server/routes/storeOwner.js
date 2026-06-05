const express = require('express');
const { 
    getDashboard,
    getRatings
} = require('../controllers/storeOwnerController');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// All store owner routes require authentication and Store Owner role
router.use(verifyToken, checkRole(['Store Owner']));

// Dashboard
router.get('/dashboard', getDashboard);

// Ratings
router.get('/ratings', getRatings);

module.exports = router;
