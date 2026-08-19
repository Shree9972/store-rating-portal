const { body } = require("express-validator");

const createUserValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 20, max: 60 })
        .withMessage( "Name must be between 20 and 60 characters" ),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage( "Please provide a valid email address" )
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 16 })
        .withMessage( "Password must be between 8 and 16 characters" )
        .matches(/[A-Z]/)
        .withMessage( "Password must contain at least one uppercase letter")
        .matches(/[^A-Za-z0-9]/)
        .withMessage( "Password must contain at least one special character"),

    body("address")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 400 })
        .withMessage( "Address cannot exceed 400 characters" ),

    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["admin", "user", "owner"])
        .withMessage( "Role must be admin, user, or owner" ),
];

module.exports = {
  createUserValidation,
};