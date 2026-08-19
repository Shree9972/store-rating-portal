const express = require("express");

const { getUsersController , createUserController} = require("../controllers/userController");
const { createUserValidation } = require("../validators/userValidator");
const { validateRequest } = require("../middleware/validationMiddleware");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin user management

router.get("/", authenticate, authorize("admin"), getUsersController);

router.post("/", authenticate, authorize("admin"), createUserValidation, validateRequest, createUserController);

module.exports = router;