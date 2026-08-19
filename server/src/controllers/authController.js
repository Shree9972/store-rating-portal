const authService = require("../services/authService");

const register = async (req, res) => {
    
  try {
    const result = await authService.registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });

  } 
  catch (error) 
  {
    console.error("Registration error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

const login = async (req, res) => {

  try {
        const result = await authService.loginUser(req.body);

        return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
        });
    } 
    catch (error) 
    {
        console.error("Login error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Registration failed",
        });
    }
};

const getCurrentUser = async (req, res) => {

    try {

        const user = await authService.getUserById(req.user.id);

            return res.status(200).json({
            success: true,
            data: {
                user,
            },
        });

    } 
    catch (error) 
    {
        console.error("Get current user error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Registration failed",
        });
    }
};

//change password controller 
const changePassword = async (req, res) => {

    try {

        const result = await authService.changePassword({
        userId: req.user.id,
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
        });

        return res.status(200).json({
        success: true,
        message: result.message,
        });

    } 
    catch (error) 
    {
        console.error(
        "Change password error:",
        error.message
        );

        return res.status(error.statusCode || 500).json({ success: false,
        message:error.statusCode ? error.message : "Failed to change password" });
    }
}; 

module.exports = {
  register,
  login,
  getCurrentUser,
  changePassword,
};