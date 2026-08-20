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

module.exports = {
  getAdminDashboard
};