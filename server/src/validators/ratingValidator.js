const { body, param } = require("express-validator");

const storeIdValidation = [ 
    param("storeId")
    .isInt({ min: 1 })
    .withMessage("Store ID must be a valid number"),
];

//rules of the rating for user
const createRatingValidation = [
  ...storeIdValidation,

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

module.exports = {
  createRatingValidation,
  storeIdValidation,
};