const storeService = require("../services/storeService");

const createStoreController = async (req, res) => {
    
    try {
        const store = await storeService.createStore(req.body);

        return res.status(201).json({
            success: true,
            message: "Store created successfully",
            data: { store },
        });

    } 
    catch (error) 
    {
        console.error("Create store error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Failed to create store",
        });
    }
};

const getStoresController = async (req, res) => {

    try {
        const stores = await storeService.getStores({
            search: req.query.search,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        });

        return res.status(200).json({
            success: true,
            data: { stores },
        });
    } 
    catch (error) 
    {
        console.error("Get stores error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Failed to get stores",
        });
    }
};

const getMyStoresController = async (req, res) => {

    try {
        const stores = await storeService.getStoresByOwner(req.user.id);

        return res.status(200).json({
            success: true,
            data: { stores },
        });
    } 
    catch (error) 
    {
        console.error("Get owner stores error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Failed to get your stores",
        });
    }
};

module.exports = { createStoreController, getStoresController, getMyStoresController };