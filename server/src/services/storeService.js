const { db } = require("../config/database");

const createStore = async ({ name, email, address, ownerId }) => {

    const [owners] = await db.query("SELECT id, role FROM users WHERE id = ?", [ownerId]);

    if(owners.length === 0) 
    {
        const error = new Error("Owner not found");
        error.statusCode = 404;
        throw error;
    }

    //check if user fetched is owner hismelf
    if(owners[0].role !== "owner") 
    {
        const error = new Error("Selected user is not a store owner");
        error.statusCode = 400;
        throw error;
    }

    const [existingStores] = await db.query("SELECT id FROM stores WHERE email = ?", [email]);

    //if store is there alread
    if(existingStores.length > 0)
    {
        const error = new Error("Store email is already registered");
        error.statusCode = 409;
        throw error;
    }

    const [result] = await db.query(
        `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
        [name, email, address, ownerId]
    );

    const [stores] = await db.query(
        `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at, u.name AS owner_name, u.email AS owner_email
         FROM stores s
         INNER JOIN users u ON s.owner_id = u.id
         WHERE s.id = ?`,
        [result.insertId]
    );

    return stores[0];
};

//list of stores and filtering with condition here 
//default is set 
const getStores = async ({ search, sortBy = "name", sortOrder = "ASC" }) => {

    const allowedSortFields = { name: "s.name", email: "s.email", address: "s.address", created_at: "s.created_at" };

    //use default as s.name here that makes errror ferr
    const sortColumn = allowedSortFields[sortBy] || "s.name";
    const order = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const valuesToQuery = [];
    let conditionClause = "";

    if(search) 
    {
        conditionClause = "WHERE s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?";
        const searchValue = `%${search}%`;
        valuesToQuery.push(searchValue, searchValue, searchValue);
    }

    const [stores] = await db.query(
        `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at, u.name AS owner_name, u.email AS owner_email
         FROM stores s INNER JOIN users u ON s.owner_id = u.id
         ${conditionClause}
         ORDER BY ${sortColumn} ${order}`,
        valuesToQuery
    );

    return stores;
};

//this is from owner to see his own store 
const getStoresByOwner = async (ownerId) => {

    const [stores] = await db.query(
        `SELECT id, name, email, address, owner_id, created_at 
        FROM stores WHERE owner_id = ? ORDER BY name ASC`,
        [ownerId]
    );

    return stores;
};


const getStoreById = async ({ storeId, userId }) => {

    const [stores] = await db.query(
        `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at, 
        u.name AS owner_name, u.email AS owner_email 
        FROM stores s INNER JOIN users u ON s.owner_id = u.id WHERE s.id = ?`,
        [storeId]
    );

    if(stores.length === 0)
    {
        const error = new Error("Store not found");
        error.statusCode = 404;
        throw error;
    }

    const store = stores[0];

    const [ratingSummary] = await db.query(
        `SELECT COUNT(*) AS total_ratings, COALESCE(AVG(rating), 0) AS average_rating FROM ratings WHERE store_id = ?`,
        [storeId]
    );

    let userRating = null;

    if(userId) 
    {
        const [ratings] = await db.query(
        `SELECT id, rating, created_at, updated_at FROM ratings WHERE store_id = ? AND user_id = ?`,
        [storeId, userId]
        );

        if (ratings.length > 0) 
        {
            userRating = ratings[0];
        }
    }

    return {
        ...store,
        ratingSummary: {
        totalRatings: Number(ratingSummary[0].total_ratings),
        averageRating: Number(Number(ratingSummary[0].average_rating).toFixed(2))
        },
        userRating
    };
};

module.exports = { createStore, getStores, getStoresByOwner , getStoreById,};