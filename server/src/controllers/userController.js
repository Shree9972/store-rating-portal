const userService = require("../services/userService");

const getUsersController = async (req, res) => {

    try {

        const users = await userService.getUsers({
            search: req.query.search,
            role: req.query.role,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        });

        return res.status(200).json({ 
            success: true,
            data: {
                users,
            },
        });

    } 
    catch (error) 
    {
        console.error("Get users error:", error.message);

        return res.status(error.statusCode || 500).json({
        success: false,
        message:
            error.statusCode
            ? error.message
            : "Failed to get users",
        });
    }
};

const createUserController = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: { user },
        });
    } catch (error) {
        console.error("Create user error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Failed to create user",
        });
    }
};

//The user is to be deleted by admin only
const deleteUserController = async (req, res) => {

    try {

        const result = await userService.deleteUser(req.params.id);

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } 
    catch (error) 
    {
        console.error("Delete user error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Failed to delete user"
        });
    }
};

module.exports = {
    getUsersController,
    createUserController,
    deleteUserController,
}