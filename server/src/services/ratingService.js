const { db } = require("../config/database");

//here make the ratng update or create new rating for particular store
const createOrUpdateRating = async ({ userId, storeId, rating }) => {

    const [stores] = await db.query("SELECT id FROM stores WHERE id = ?", [storeId]);

    //check if store exist first
    if (stores.length === 0) 
    {
        const error = new Error("Store not found");
        error.statusCode = 404;
        throw error;
    }

    //check if already rated becuase stored_id and user_id is unique cant make duplicaete ratings
    const [existingRatings] = await db.query( "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?", [userId, storeId]);

    if (existingRatings.length > 0) 
    {
        //make new updation  here 
        await db.query(
            "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
            [rating, userId, storeId]
        );

        return {action : "updated" , message: "Rating updated successfully" };
    }

    //new ratin here 
    await db.query(
        "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
        [userId, storeId, rating]
    );

    return { action: "created", message: "Rating submitted successfully" };
};

//get rating for a praticular store here with user_id who has rated 
//this would be later used for user to see who he has rated
const getUserRating = async ({ userId, storeId }) => {

    const [ratings] = await db.query(
        "SELECT id, user_id, store_id, rating, created_at, updated_at FROM ratings WHERE user_id = ? AND store_id = ?",
        [userId, storeId]
    );

    if(ratings.length === 0) 
    {
        return null;
    }

    return ratings[0];
};

//get the stors rating  from this with user-id as well in dscein sorted
//this si used by owner to see how his store is being rated by everyone 
const getStoreRatings = async (storeId) => {

    // if store not exist then send error 
    const [stores] = await db.query(
        `SELECT id FROM stores WHERE id = ?`,
        [storeId]
    );

    if(stores.length === 0) 
    {
        const error = new Error("Store not found");
        error.statusCode = 404;
        throw error;
    }

    // get rating for for prarticualr stre ehre
    const [ratings] = await db.query(
        `SELECT r.id, r.rating, r.created_at, r.updated_at, u.id AS user_id, u.name AS user_name 
        FROM ratings r INNER JOIN users u 
        ON r.user_id = u.id WHERE r.store_id = ? ORDER BY r.created_at DESC`,
        [storeId]
    );

    return ratings;
};

//get the average rating of stores here 
//make this requeist in real time so to get udpted aratings here with averga eto calculate 
const getStoreRatingSummary = async (storeId) => {

    const [stores] = await db.query("SELECT id FROM stores WHERE id = ?", [storeId]);

    //if store not found which is user requesting
    if (stores.length === 0) 
    {
        const error = new Error("Store not found");
        error.statusCode = 404;
        throw error;
    }

    //get the average and count of the ratings as well for apartcular store
    const [summary] = await db.query(
        "SELECT COUNT(*) AS total_ratings, COALESCE(AVG(rating), 0) AS average_rating FROM ratings WHERE store_id = ?",
        [storeId]
    );

    return {
        totalRatings: Number(summary[0].total_ratings),
        averageRating: Number(Number(summary[0].average_rating).toFixed(2)),
    };
};

module.exports = { createOrUpdateRating, getUserRating, getStoreRatings, getStoreRatingSummary };