const { db } = require("../config/database");


//this is entire admin dashboard with its specifie requirement 
//we will call this to get entire dashobord of admins

const getAdminDashboard = async () => {

    const [userResult] = await db.query(`SELECT COUNT(*) AS total_users FROM users`);

    const [storeResult] = await db.query(`SELECT COUNT(*) AS total_stores FROM stores`);

    const [ratingResult] = await db.query(`SELECT COUNT(*) AS total_ratings FROM ratings`);

    return {
        totalUsers: Number(userResult[0].total_users),
        totalStores: Number(storeResult[0].total_stores),
        totalRatings: Number(ratingResult[0].total_ratings)
    };

};


//Only owner is going to call this and it is used for the showing of his own stores
const getStoresByOwner = async (ownerId) => {

    const [stores] = await db.query(
        `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
                COUNT(r.id) AS total_ratings, COALESCE(AVG(r.rating), 0) AS average_rating
        FROM stores s
        LEFT JOIN ratings r ON r.store_id = s.id
        WHERE s.owner_id = ?
        GROUP BY s.id
        ORDER BY s.name ASC`,
        [ownerId]
    );

  return stores;
};


const getStoreRatings = async (storeId, ownerId) => {
    const [stores] = await db.query(
        "SELECT id FROM stores WHERE id = ? AND owner_id = ?",
        [storeId, ownerId]
    );

    if (!stores.length) {
        const error = new Error("Store not found or you do not have access to this store");
        error.statusCode = 403;
        throw error;
    }

    const [ratings] = await db.query(
        `SELECT r.id, r.rating, r.created_at, r.updated_at,
                u.id AS user_id, u.name AS user_name
        FROM ratings r
        INNER JOIN users u ON r.user_id = u.id
        WHERE r.store_id = ?
        ORDER BY r.created_at DESC`,
        [storeId]
    );

  return ratings;
};

module.exports = { 
    getAdminDashboard, 
    getStoresByOwner,
    getStoreRatings,
};
