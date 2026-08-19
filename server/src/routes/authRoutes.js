const express = require("express");

const { register, login, getCurrentUser, changePassword } = require("../controllers/authController");

const { registerValidation, loginValidation, changePasswordValidation } = require("../validators/authValidator");

const { validateRequest } = require("../middleware/validationMiddleware");

const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();



//All routes for authentication services

router.post("/register", registerValidation, validateRequest, register);

router.post("/login", loginValidation, validateRequest, login);

router.get("/me", authenticate, getCurrentUser);

router.patch("/change-password", authenticate, changePasswordValidation, validateRequest, changePassword);

module.exports = router;