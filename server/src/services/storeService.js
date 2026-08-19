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

module.exports = { createStore, getStores, getStoresByOwner };