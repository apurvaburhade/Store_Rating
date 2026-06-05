const express = require('express');
const { 
    getStores,
    searchStores,
    submitRating,
    updateRating,
    getMyRatings
} = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication and Normal user role
router.use(verifyToken, checkRole(['Normal']));

// Store operations
router.get('/stores', getStores);
router.get('/stores/search', searchStores);
router.get('/ratings/my-ratings', getMyRatings);

// Rating operations
router.post('/ratings', submitRating);
router.put('/ratings/:storeId', updateRating);

module.exports = router;
