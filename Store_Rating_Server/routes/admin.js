const express = require('express');
const { 
    addUser, 
    addStore, 
    getDashboard, 
    getStores, 
    getUsers, 
    getUserDetails 
} = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and Admin role
router.use(verifyToken, checkRole(['Admin']));

// Dashboard
router.get('/dashboard', getDashboard);

// Users
router.post('/users', addUser);
router.get('/users', getUsers);
router.get('/users/:userId', getUserDetails);

// Stores
router.post('/stores', addStore);
router.get('/stores', getStores);

module.exports = router;
