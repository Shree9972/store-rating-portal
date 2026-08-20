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

const getOwnerDashboard = async (ownerId) => {

    const [stores] = await db.query(

        `SELECT s.id, s.name, s.email, s.address,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS total_ratings
        FROM stores s

        LEFT JOIN ratings r ON s.id = r.store_id

        WHERE s.owner_id = ?
        GROUP BY s.id, s.name, s.email, s.address
        ORDER BY s.name ASC`,

        [ownerId]
    );

    const storeIds = stores.map((store) => store.id);

    let ratings = [];

    //getting here all the users who have submitted rating for a store supports mutlistore owner as well
    if (storeIds.length > 0) 
    {
        const placeholders = storeIds.map(() => "?").join(", ");

        const [ratingRows] = await db.query(

            `SELECT r.id, r.store_id, r.rating, r.created_at,
                u.id AS user_id, u.name AS user_name, u.email AS user_email
            FROM ratings r

            INNER JOIN users u ON r.user_id = u.id

            WHERE r.store_id IN (${placeholders})

            ORDER BY r.created_at DESC`,

            storeIds

        );

        ratings = ratingRows;
    }


    //to support multiple users here 
    return stores.map((store) => ({

        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,

        averageRating: Number(Number(store.average_rating).toFixed(2)),
        totalRatings: Number(store.total_ratings),

        //get ratings which are specifically for this store that only 
        //match the store id with current store id 
        ratings: ratings.filter((rating) => rating.store_id === store.id).map((rating) => ({

            id: rating.id,
            rating: Number(rating.rating),

            user: {
                id: rating.user_id,
                name: rating.user_name,
                email: rating.user_email
            },

            createdAt: rating.created_at

        }))

    }));

};

module.exports = { 
    getAdminDashboard, 
    getOwnerDashboard 
};
