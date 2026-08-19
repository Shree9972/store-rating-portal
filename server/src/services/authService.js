const bcrypt = require("bcryptjs");

const { db } = require("../config/database");

const generateToken = require("../utils/generateToken");

const registerUser = async ({ name, email,password, address}) => {

    const [existingUsers] = await db.query( "SELECT id FROM users WHERE email = ?", [email]);

    //check if already there 
    if (existingUsers.length > 0) 
    {
        const error = new Error("Email is already registered");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query( `INSERT INTO users 
        (name, email, password, address, role) VALUES (?, ?, ?, ?, 'user') `, 
        [name, email, hashedPassword, address || null] );

    const [users] = await db.query(
        `
        SELECT  id, name, email,  address, role, created_at FROM users 
        WHERE id = ? 
        `,
        [result.insertId]
    );

    const user = users[0];

    const token = generateToken(user);

    return {
        user,
        token,
    };
};

const loginUser = async ({ email, password }) => {

    const [users] = await db.query(`SELECT id, name, email, password, address, role, created_at FROM users WHERE email = ?`, [email]);

    if (users.length === 0) 
    {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password,user.password);

    if (!passwordMatch) 
    {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    delete user.password;

    const token = generateToken(user);

    return {
        user,
        token,
    };
};

const getUserById = async (userId) => {

    const [users] = await db.query(`SELECT id, name, email, address, role, created_at FROM users WHERE id = ?`, [userId]);

    if (users.length === 0) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return users[0];
};

const changePassword = async ({ userId, currentPassword, newPassword }) => {

    const [users] = await db.query(`SELECT id, password FROM users WHERE id = ?`, [userId]);

    if (users.length === 0) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) 
    {
        const error = new Error("Current password is incorrect");
        error.statusCode = 400;
        throw error;
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) 
    {
        const error = new Error("New password must be different from the current password");
        error.statusCode = 400;
        throw error;
    }

    //create new password and store
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId]);

    return { message: "Password changed successfully" };
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  changePassword,
};