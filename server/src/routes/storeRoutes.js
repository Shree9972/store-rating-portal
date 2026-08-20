const express = require("express");

const { createStoreController, getStoresController, getMyStoresController , getStoreByIdController, } = require("../controllers/storeController");
const { createStoreValidation , storeIdValidation} = require("../validators/storeValidator");
const { validateRequest } = require("../middleware/validationMiddleware");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// all stores from this ansy user can see it may be owner , administrator , user 
router.get("/", authenticate, getStoresController);

// creating stires only admin see it 
router.post("/", authenticate, authorize("admin"), createStoreValidation, validateRequest, createStoreController);

// owner can see his stores 
router.get("/my-stores", authenticate, authorize("owner"), getMyStoresController);

// store dashboard in one request
router.get("/:id", authenticate, storeIdValidation, validateRequest, getStoreByIdController);

module.exports = router;