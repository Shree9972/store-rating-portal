const express = require("express");

const { createOrUpdateRatingController, getMyRatingController, getStoreRatingsController, getStoreRatingSummaryController } = require("../controllers/ratingController");
const { createRatingValidation, storeIdValidation } = require("../validators/ratingValidator");
const { validateRequest } = require("../middleware/validationMiddleware");
const { authenticate , authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:storeId", authenticate, authorize("user"), createRatingValidation, validateRequest, createOrUpdateRatingController);

router.get("/:storeId/me", authenticate, authorize("user"), storeIdValidation, validateRequest, getMyRatingController);

router.get("/:storeId", authenticate, authorize("owner"), storeIdValidation, validateRequest, getStoreRatingsController);

router.get("/:storeId/summary", authenticate, storeIdValidation, validateRequest, getStoreRatingSummaryController);

module.exports = router;