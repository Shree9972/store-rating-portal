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

const getOwnerDashboardController = async (req, res) => {
  try {
    const dashboard = await dashboardService.getOwnerDashboard(req.user.id);

    return res.status(200).json({
      success: true,
      data: { dashboard }
    });
  } catch (error) {
    console.error("Owner dashboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load owner dashboard"
    });
  }
};

module.exports = {
  getAdminDashboardController,
  getOwnerDashboardController,
};