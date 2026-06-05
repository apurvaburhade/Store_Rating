const pool = require('../utils/db');

// Get store owner dashboard
const getDashboard = (req, res) => {
    const userId = req.user.id;

    // Get all stores owned by this user
    pool.query('SELECT id FROM stores WHERE owner_id = ?', [userId], (error, storeResults) => {
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        if (storeResults.length === 0) {
            return res.status(200).json({
                success: true,
                dashboard: {
                    averageRating: 0,
                    totalRatings: 0,
                    stores: []
                }
            });
        }

        const storeIds = storeResults.map(s => s.id);

        // Get ratings and statistics for these stores
        const query = `
            SELECT 
                s.id as storeId,
                s.name as storeName,
                COALESCE(ROUND(AVG(r.rating_value), 2), 0) as averageRating,
                COUNT(r.id) as totalRatings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.id IN (${storeIds.join(',')})
            GROUP BY s.id
        `;

        pool.query(query, (error, results) => {
            if (error) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            const overallAverage = results.length > 0
                ? (results.reduce((sum, r) => sum + r.averageRating, 0) / results.length).toFixed(2)
                : 0;

            const totalRatings = results.reduce((sum, r) => sum + r.totalRatings, 0);

            return res.status(200).json({
                success: true,
                dashboard: {
                    averageRating: parseFloat(overallAverage),
                    totalRatings: totalRatings,
                    stores: results
                }
            });
        });
    });
};

// Get users who rated any of store owner's stores
const getRatings = (req, res) => {
    const userId = req.user.id;
    const { storeId = null, sortBy = 'rating', order = 'DESC' } = req.query;

    const validSortFields = ['storeName', 'rating', 'submittedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'rating';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let orderBy = 'r.rating_value';
    if (sortField === 'storeName') orderBy = 's.name';
    if (sortField === 'submittedAt') orderBy = 'r.created_at';

    let query = `
        SELECT 
            r.id as ratingId,
            r.user_id as userId,
            u.name as userName,
            s.id as storeId,
            s.name as storeName,
            r.rating_value as rating,
            r.created_at as submittedAt
        FROM ratings r
        JOIN stores s ON r.store_id = s.id
        JOIN users u ON r.user_id = u.id
        WHERE s.owner_id = ?
    `;

    const params = [userId];

    if (storeId) {
        query += ` AND s.id = ?`;
        params.push(storeId);
    }

    query += ` ORDER BY ${orderBy} ${sortOrder}`;

    pool.query(query, params, (error, results) => {
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
    getDashboard,
    getRatings
};
