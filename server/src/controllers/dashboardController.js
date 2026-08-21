const dashboardService = require("../services/dashboardService");

//conrtoller to clal teh servcie of the dashboard panel
const getAdminDashboardController = async (req, res) => {

    try 
    {
        const dashboard = await dashboardService.getAdminDashboard();

        return res.status(200).json({
        success: true,
        data: { dashboard }
        });

    } 
    catch (error)
    {
        console.error("Admin dashboard error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to load admin dashboard"
        });
    }
};


const getMyStoresDashboardController = async (req, res) => {

    try {
        const stores = await dashboardService.getStoresByOwner(req.user.id);

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


const getStoreRatingsDashboardController = async (req, res) => {

    try {
        const ratings = await dashboardService.getStoreRatings(req.params.storeId, req.user.id);

        return res.status(200).json({
            success: true,
            message: ratings.length === 0 ? "No ratings found for this store" : "Ratings fetched successfully",
            data: {
                ratings,
            },
        });

    } 
    catch (error) 
    {
        console.error("Get store ratings error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : "Failed to get store ratings",
        });
    }
};

module.exports = {
  getAdminDashboardController,
  getMyStoresDashboardController,
  getStoreRatingsDashboardController
};