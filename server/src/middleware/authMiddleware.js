const jwt = require("jsonwebtoken");
const { db } = require("../config/database");

const authenticate = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) 
    {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //cehck if user exist becuase if user has jwt token but he was already deleted by admin 
    //he might have seen the info of our app
    const [users] = await db.query(
      `SELECT id, name, email, role FROM users WHERE id = ?`,
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists"
      });
    }

    req.user = users[0];
    next();
  } 
  catch (error) 
  {

    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token"
    });
  }

};

const authorize = (...allowedRoles) => {
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action"
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};