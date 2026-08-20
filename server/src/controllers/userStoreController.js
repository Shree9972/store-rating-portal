const userStoreService = require("../services/userStoreService");

const getStoresForUserController = async (req, res) => {
  try {
    const stores = await userStoreService.getStoresForUser({
      userId: req.user.id,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder
    });

    return res.status(200).json({
      success: true,
      data: { stores }
    });
  } catch (error) {
    console.error("User store listing error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load stores"
    });
  }
};

module.exports = { getStoresForUserController };