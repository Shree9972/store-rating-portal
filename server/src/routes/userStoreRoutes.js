const express = require("express");
const { getStoresForUserController } = require("../controllers/userStoreController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, authorize("user"), getStoresForUserController);

module.exports = router;