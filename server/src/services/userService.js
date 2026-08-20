const bcrypt = require("bcryptjs");
const { db } = require("../config/database");

const getUsers = async ({ search, role, sortBy = "created_at", sortOrder = "DESC" }) => {

    const allowedSortFields = { name: "name", email: "email", role: "role", created_at: "created_at" };

    const sortColumn = allowedSortFields[sortBy] || "created_at";
    const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // valuesToQuery wriet the actual values
    const conditionsToFilter = [];
    const valuesToQuery = [];

    // Add coNDitions for filtering
    if (search) {
        conditionsToFilter.push("(name LIKE ? OR email LIKE ? OR address LIKE ?)");
        const searchValue = `%${search}%`;
        valuesToQuery.push(searchValue, searchValue, searchValue);
    }

    if (role) 
    {
        conditionsToFilter.push("role = ?");
        valuesToQuery.push(role);
    }

    const conditionClause = conditionsToFilter.length ? `WHERE ${conditionsToFilter.join(" AND ")}` : "" ;

    const query = `
        SELECT id, name, email, address, role, created_at, updated_at
        FROM users ${conditionClause}
        ORDER BY ${sortColumn} ${order}
    `;

    const [users] = await db.query(query, valuesToQuery);

    return users;
};

//create the user with specific role and only admin can do this
const createUser = async ({ name, email, password, address, role }) => {

    const allowedRoles = ["admin", "user", "owner"];

    if (!allowedRoles.includes(role)) 
    {
        const error = new Error("Invalid user role");
        error.statusCode = 400;
        throw error;
    }

    const [existingUsers] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) 
    {
        const error = new Error("Email is already registered");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
        `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, address || null, role]
    );

    const [users] = await db.query(
        `SELECT id, name, email, address, role, created_at FROM users WHERE id = ?`,
        [result.insertId]
    );

    return users[0];
};

//deelete user from here by admisn on ly no user or can delete hismelf or owner
const deleteUser = async (userId) => {

    const [users] = await db.query(
        `SELECT id, role FROM users WHERE id = ?`,
        [userId]
    );

    if(users.length === 0) 
    {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if(users[0].role === "admin") 
    {
        const error = new Error("Admin users cannot be deleted");
        error.statusCode = 400;
        throw error;
    }

    await db.query(
        `DELETE FROM users WHERE id = ?`,
        [userId]
    );

    return {
        message: "User deleted successfully"
    };
};


//get user details here and only admins can see it 
//with detailed page
const getUserById = async (userId) => {

    const [users] = await db.query(
        `SELECT id, name, email, address, role, created_at, updated_at FROM users WHERE id = ?`,
        [userId]
    );

    if(users.length === 0) 
    {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const user = users[0];

    //check if he is owner thne we will pass the owner wiht his stores int it

    if(user.role === "owner")
    {
        const [stores] = await db.query(

            `SELECT s.id, s.name, s.email, s.address,
            
                COALESCE(AVG(r.rating), 0) AS average_rating,
                COUNT(r.id) AS total_ratings FROM stores s

            LEFT JOIN ratings r ON s.id = r.store_id

            WHERE s.owner_id = ?

            GROUP BY s.id, s.name, s.email, s.address

            ORDER BY s.name ASC`,

            [userId]
            
        );

        return {

            ...user,

            stores: stores.map((store) => ({

                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                averageRating: Number(Number(store.average_rating).toFixed(2)),
                totalRatings: Number(store.total_ratings)

            }))
        };
    }

  return { ...user, stores: [] };
};

module.exports = {
    getUsers,
    createUser,
    deleteUser,
    getUserById,
}