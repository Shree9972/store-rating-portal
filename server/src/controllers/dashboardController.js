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

module.exports = {
  getAdminDashboardController
};