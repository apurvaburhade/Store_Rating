const pool = require('../utils/db');
const { validateRating } = require('../helpers/validation');

// Get all stores (with user's rating if exists)
const getStores = (req, res) => {
    const userId = req.user.id;
    const { sortBy = 'name', order = 'ASC', search = '' } = req.query;

    const validSortFields = ['name', 'address', 'rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const orderBy = sortField === 'rating' ? 'overallRating' : `s.${sortField}`;

    let query = `
        SELECT 
            s.id, 
            s.name, 
            s.address,
            COALESCE(ROUND(AVG(r.rating_value), 2), 0) as overallRating,
            COALESCE(ur.rating_value, 0) as userRating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
    `;

    const params = [userId];

    if (search) {
        query += ` WHERE s.name LIKE ? OR s.address LIKE ?`;
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY s.id ORDER BY ${orderBy} ${sortOrder}`;

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

// Search stores by name and address
const searchStores = (req, res) => {
    const userId = req.user.id;
    const { name = '', address = '', sortBy = 'name', order = 'ASC' } = req.query;

    if (!name && !address) {
        return res.status(400).json({
            success: false,
            message: 'At least one search parameter (name or address) is required'
        });
    }

    const validSortFields = ['name', 'address', 'rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const orderBy = sortField === 'rating' ? 'overallRating' : `s.${sortField}`;

    let query = `
        SELECT 
            s.id, 
            s.name, 
            s.address,
            COALESCE(ROUND(AVG(r.rating_value), 2), 0) as overallRating,
            COALESCE(ur.rating_value, 0) as userRating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
        WHERE 1=1
    `;

    const params = [userId];

    if (name) {
        query += ` AND s.name LIKE ?`;
        params.push(`%${name}%`);
    }

    if (address) {
        query += ` AND s.address LIKE ?`;
        params.push(`%${address}%`);
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

// Submit a rating for a store
const submitRating = (req, res) => {
    const userId = req.user.id;
    const { storeId, rating } = req.body;

    // Validation
    if (!storeId || !rating) {
        return res.status(400).json({
            success: false,
            message: 'Store ID and rating are required'
        });
    }

    if (!validateRating(rating)) {
        return res.status(400).json({
            success: false,
            message: 'Rating must be between 1 and 5'
        });
    }

    // Check if store exists
    pool.query('SELECT * FROM stores WHERE id = ?', [storeId], (error, results) => {
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        // Check if user already rated this store
        pool.query(
            'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
            [userId, storeId],
            (error, ratingResults) => {
                if (error) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Database error' 
                    });
                }

                if (ratingResults.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'You have already rated this store. Use the update endpoint to modify your rating'
                    });
                }

                // Insert rating
                pool.query(
                    'INSERT INTO ratings (user_id, store_id, rating_value) VALUES (?, ?, ?)',
                    [userId, storeId, rating],
                    (error) => {
                        if (error) {
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Error submitting rating' 
                            });
                        }

                        return res.status(201).json({
                            success: true,
                            message: 'Rating submitted successfully'
                        });
                    }
                );
            }
        );
    });
};

// Update a rating for a store
const updateRating = (req, res) => {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { rating } = req.body;

    // Validation
    if (!rating) {
        return res.status(400).json({
            success: false,
            message: 'Rating is required'
        });
    }

    if (!validateRating(rating)) {
        return res.status(400).json({
            success: false,
            message: 'Rating must be between 1 and 5'
        });
    }

    // Check if rating exists
    pool.query(
        'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
        [userId, storeId],
        (error, results) => {
            if (error) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No rating found for this store'
                });
            }

            // Update rating
            pool.query(
                'UPDATE ratings SET rating_value = ? WHERE user_id = ? AND store_id = ?',
                [rating, userId, storeId],
                (error) => {
                    if (error) {
                        return res.status(500).json({ 
                            success: false, 
                            message: 'Error updating rating' 
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: 'Rating updated successfully'
                    });
                }
            );
        }
    );
};

// Get user's submitted ratings
const getMyRatings = (req, res) => {
    const userId = req.user.id;
    const { sortBy = 'storeName', order = 'ASC' } = req.query;

    const validSortFields = ['storeName', 'rating', 'submitted'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'storeName';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let orderBy = 's.name';
    if (sortField === 'rating') orderBy = 'r.rating_value';
    if (sortField === 'submitted') orderBy = 'r.created_at';

    const query = `
        SELECT 
            r.id as ratingId,
            s.id as storeId,
            s.name as storeName,
            s.address,
            r.rating_value as rating,
            r.created_at as submittedAt,
            r.updated_at as updatedAt
        FROM ratings r
        JOIN stores s ON r.store_id = s.id
        WHERE r.user_id = ?
        ORDER BY ${orderBy} ${sortOrder}
    `;

    pool.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        return res.status(200).json({
            success: true,
            ratings: results
        });
    });
};

module.exports = {
    getStores,
    searchStores,
    submitRating,
    updateRating,
    getMyRatings
};
