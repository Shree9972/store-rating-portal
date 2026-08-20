const express = require("express");

const { getAdminDashboardController } = require("../controllers/dashboardController");

const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/admin", authenticate, authorize("admin"), getAdminDashboardController);

module.exports = router;