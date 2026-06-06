const pool = require('../utils/db');
const bcrypt = require('bcryptjs');
const { validateEmail, validatePassword, validateName, validateAddress } = require('../helpers/validation');

// Add new user (Admin only)
const addUser = (req, res) => {
    const { name, email, password, address, role } = req.body;

    // Validation
    if (!name || !email || !password || !address || !role) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required' 
        });
    }

    if (!validateName(name)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Name must be between 20 and 60 characters' 
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid email format' 
        });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must be 8-16 characters with at least one uppercase letter and one special character' 
        });
    }

    if (!validateAddress(address)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Address must be max 400 characters' 
        });
    }

    const validRoles = ['Admin', 'Normal', 'Store Owner'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid role. Must be Admin, Normal, or Store Owner' 
        });
    }

    // Check if email already exists
    pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        if (results.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is already registered' 
            });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert user
        pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role],
            (error) => {
                if (error) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error adding user' 
                    });
                }

                return res.status(201).json({ 
                    success: true, 
                    message: 'User added successfully' 
                });
            }
        );
    });
};

// Add new store (Admin only)
const addStore = (req, res) => {
    const { owner_id, name, email, address } = req.body;

    // Validation
    if (!owner_id || !name || !email || !address) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required' 
        });
    }

    if (name.length < 1 || name.length > 100) {
        return res.status(400).json({ 
            success: false, 
            message: 'Store name must be between 1 and 100 characters' 
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid email format' 
        });
    }

    if (!validateAddress(address)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Address must be max 400 characters' 
        });
    }

    // Check if owner exists and is a Store Owner
    pool.query('SELECT * FROM users WHERE id = ? AND role = ?', [owner_id, 'Store Owner'], (error, results) => {
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Store owner not found or user is not a Store Owner' 
            });
        }

        // Check if email already exists
        pool.query('SELECT * FROM stores WHERE email = ?', [email], (error, results) => {
            if (error) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            if (results.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Store email is already registered' 
                });
            }

            // Insert store
            pool.query(
                'INSERT INTO stores (owner_id, name, email, address) VALUES (?, ?, ?, ?)',
                [owner_id, name, email, address],
                (error) => {
                    if (error) {
                        return res.status(500).json({ 
                            success: false, 
                            message: 'Error adding store' 
                        });
                    }

                    return res.status(201).json({ 
                        success: true, 
                        message: 'Store added successfully' 
                    });
                }
            );
        });
    });
};

// Get dashboard statistics (Admin only)
const getDashboard = (req, res) => {
    Promise.all([
        new Promise((resolve, reject) => {
            pool.query('SELECT COUNT(*) as count FROM users WHERE role != "Admin"', (error, results) => {
                if (error) reject(error);
                else resolve(results[0].count);
            });
        }),
        new Promise((resolve, reject) => {
            pool.query('SELECT COUNT(*) as count FROM stores', (error, results) => {
                if (error) reject(error);
                else resolve(results[0].count);
            });
        }),
        new Promise((resolve, reject) => {
            pool.query('SELECT COUNT(*) as count FROM ratings', (error, results) => {
                if (error) reject(error);
                else resolve(results[0].count);
            });
        })
    ])
    .then(([usersCount, storesCount, ratingsCount]) => {
        return res.status(200).json({
            success: true,
            dashboard: {
                totalUsers: usersCount,
                totalStores: storesCount,
                totalRatings: ratingsCount
            }
        });
    })
    .catch((error) => {
        return res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data'
        });
    });
};

// Get all stores with details (Admin only)
const getStores = (req, res) => {
    const { sortBy = 'name', order = 'ASC', search = '' } = req.query;

    const validSortFields = ['name', 'email', 'address'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
        SELECT 
            s.id, 
            s.name, 
            s.email, 
            s.address,
            COALESCE(ROUND(AVG(r.rating_value), 2), 0) as rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
    `;

    const params = [];

    if (search) {
        query += ` WHERE s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY s.id ORDER BY s.${sortField} ${sortOrder}`;

    pool.query(query, params, (error, results) => {
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        return res.status(200).json({
            success: true,
            stores: results
        });
    });
};

// Get all users with details (Admin only)
const getUsers = (req, res) => {
    const { sortBy = 'name', order = 'ASC', search = '', role = '' } = req.query;

    const validSortFields = ['name', 'email', 'address', 'role'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    const params = [];

    if (search) {
        query += ` AND (name LIKE ? OR email LIKE ? OR address LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role && ['Normal', 'Store Owner', 'Admin'].includes(role)) {
        query += ` AND role = ?`;
        params.push(role);
    }

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    pool.query(query, params, (error, results) => {
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        return res.status(200).json({
            success: true,
            users: results
        });
    });
};

// Get user details by ID (Admin only)
const getUserDetails = (req, res) => {
    const { userId } = req.params;

    pool.query('SELECT id, name, email, address, role FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const user = results[0];

        // If Store Owner, get their average rating
        if (user.role === 'Store Owner') {
            pool.query(`
                SELECT COALESCE(ROUND(AVG(r.rating_value), 2), 0) as rating
                FROM stores s
                LEFT JOIN ratings r ON s.id = r.store_id
                WHERE s.owner_id = ?
            `, [userId], (error, ratingResults) => {
                if (error) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Database error' 
                    });
                }

                user.rating = ratingResults[0].rating;

                return res.status(200).json({
                    success: true,
                    user
                });
            });
        } else {
            return res.status(200).json({
                success: true,
                user
            });
        }
    });
};

module.exports = {
    addUser,
    addStore,
    getDashboard,
    getStores,
    getUsers,
    getUserDetails
};
