const express = require("express");

const { getAdminDashboardController, getOwnerDashboardController } = require("../controllers/dashboardController");

const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/admin", authenticate, authorize("admin"), getAdminDashboardController);

router.get("/owner", authenticate, authorize("owner"), getOwnerDashboardController);

module.exports = router;