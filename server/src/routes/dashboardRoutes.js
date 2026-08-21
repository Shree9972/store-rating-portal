const express = require("express");

const { storeIdValidation } = require("../validators/ratingValidator");
const { validateRequest } = require("../middleware/validationMiddleware");

const { getAdminDashboardController, getMyStoresDashboardController , getStoreRatingsDashboardController} = require("../controllers/dashboardController");

const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/admin", authenticate, authorize("admin"), getAdminDashboardController);

router.get("/my-stores", authenticate, authorize("owner"), getMyStoresDashboardController);

router.get("/:storeId", authenticate, authorize("owner"), storeIdValidation, validateRequest, getStoreRatingsDashboardController);

module.exports = router;