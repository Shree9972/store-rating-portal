const express = require("express");

const { createOrUpdateRatingController, getMyRatingController, getStoreRatingsController, getStoreRatingSummaryController } = require("../controllers/ratingController");
const { createRatingValidation, storeIdValidation } = require("../validators/ratingValidator");
const { validateRequest } = require("../middleware/validationMiddleware");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:storeId", authenticate, createRatingValidation, validateRequest, createOrUpdateRatingController);

router.get("/:storeId/me", authenticate, storeIdValidation, validateRequest, getMyRatingController);

router.get("/:storeId", authenticate, storeIdValidation, validateRequest, getStoreRatingsController);

router.get("/:storeId/summary", authenticate, storeIdValidation, validateRequest, getStoreRatingSummaryController);

module.exports = router;