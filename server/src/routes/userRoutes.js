const express = require("express");

const { getUsersController , createUserController, deleteUserController, getUserByIdController} = require("../controllers/userController");
const { createUserValidation , userIdValidation} = require("../validators/userValidator");
const { validateRequest } = require("../middleware/validationMiddleware");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin user management

router.get("/", authenticate, authorize("admin"), getUsersController);

router.post("/", authenticate, authorize("admin"), createUserValidation, validateRequest, createUserController);

router.delete("/:id", authenticate, authorize("admin"), userIdValidation, validateRequest, deleteUserController);

router.get("/:id", authenticate, authorize("admin"), userIdValidation, validateRequest, getUserByIdController);

module.exports = router;