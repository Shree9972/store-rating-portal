const { body } = require("express-validator");

//validte the apassword if it matches these rules 

const passwordRules = (field) => {

  return body(field)
    .notEmpty().withMessage(`${field} is required`)
    .isLength({ min: 8, max: 16 })
    .withMessage(`${field} must be between 8 and 16 characters`)
    .matches(/[A-Z]/)
    .withMessage(`${field} must contain at least one uppercase letter`)
    .matches(/[^A-Za-z0-9]/)
    .withMessage(`${field} must contain at least one special character`);

};

//validate all feilds requied for registration to be in structured format
const registerValidation = [

  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 20, max: 60 }).withMessage("Name must be between 20 and 60 characters"),

  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email address").normalizeEmail(),

  passwordRules("password"),

  body("address").optional({ nullable: true }).trim().isLength({ max: 400 }).withMessage("Address cannot exceed 400 characters"),

];

//login just validate email adn passwords s
const loginValidation = [

  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),

];

//change password validation
const changePasswordValidation = [

  body("currentPassword").notEmpty().withMessage("Current password is required"),
  passwordRules("newPassword"),

];

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
};