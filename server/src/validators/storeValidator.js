const { body, param } = require("express-validator");

const createStoreValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Store name is required")
        .isLength({ min: 20, max: 60 })
        .withMessage(
        "Store name must be between 20 and 60 characters"
        ),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Store email is required")
        .isEmail()
        .withMessage(
        "Please provide a valid store email"
        )
        .normalizeEmail(),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Store address is required")
        .isLength({ max: 400 })
        .withMessage(
        "Store address cannot exceed 400 characters"
        ),

    body("ownerId")
        .notEmpty()
        .withMessage("Owner is required")
        .isInt({ min: 1 })
        .withMessage("Owner ID must be a valid number"),
];

const storeIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Store ID must be a valid number"),
];

module.exports = {
  createStoreValidation,
  storeIdValidation,
};