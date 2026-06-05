const pool = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/auth');
const { validateEmail, validatePassword, validateName, validateAddress } = require('../helpers/validation');

const validRegistrationRoles = {
    normal: 'Normal',
    'store owner': 'Store Owner'
};

// Register new user (Normal or Store Owner)
const register = (req, res) => {
    const { name, email, password, address, role } = req.body;

    // Validation
    if (!name || !email || !password || !address) {
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

    let userRole = 'Normal';

    if (role !== undefined) {
        const normalizedRole = String(role).trim().toLowerCase();
        if (normalizedRole === '') {
            userRole = 'Normal';
        } else if (validRegistrationRoles[normalizedRole]) {
            userRole = validRegistrationRoles[normalizedRole];
        } else {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid role. Allowed roles are Normal or Store Owner.'
            });
        }
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
            [name, email, hashedPassword, address, userRole],
            (error) => {
                if (error) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error registering user' 
                    });
                }

                return res.status(201).json({ 
                    success: true, 
                    message: 'User registered successfully',
                    role: userRole
                });
            }
        );
    });
};

// Login
const login = (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid email format' 
        });
    }

    // Find user by email
    pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        if (results.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email or password is incorrect' 
            });
        }

        const user = results[0];

        // Compare passwords
        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email or password is incorrect' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                name: user.name 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return res.status(200).json({ 
            success: true, 
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            }
        });
    });
};

// Update password
const updatePassword = (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
            success: false, 
            message: 'Current and new passwords are required' 
        });
    }

    if (!validatePassword(newPassword)) {
        return res.status(400).json({ 
            success: false, 
            message: 'New password must be 8-16 characters with at least one uppercase letter and one special character' 
        });
    }

    // Get user
    pool.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
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

        // Verify current password
        const passwordMatch = bcrypt.compareSync(currentPassword, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }

        // Hash new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        // Update password
        pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (error) => {
            if (error) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error updating password' 
                });
            }

            return res.status(200).json({ 
                success: true, 
                message: 'Password updated successfully' 
            });
        });
    });
};

// Logout (client should remove the token locally)
const logout = (req, res) => {
    return res.status(200).json({ 
        success: true, 
        message: 'Logout successful' 
    });
};

module.exports = {
    register,
    login,
    updatePassword,
    logout}
