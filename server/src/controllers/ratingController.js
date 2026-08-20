const ratingService = require("../services/ratingService");

//make the ratin controller here or update if it there already
const createOrUpdateRatingController = async (req, res) => {

    try {

        const result = await ratingService.createOrUpdateRating({
            userId: req.user.id,
            storeId: req.params.storeId,
            rating: req.body.rating,
        });

        return res.status(200).json({
            success: true,
            message: result.message,
            data: { action: result.action },
        });

    } 
    catch (error) 
    {
        console.error("Rating error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Failed to submit rating",
        });
    }
};



const getMyRatingController = async (req, res) => {

    try 
    {
        const rating = await ratingService.getUserRating({
            userId: req.user.id,
            storeId: req.params.storeId,
        });

        return res.status(200).json({
            success: true,
            data: { rating },
        });
    } 
    catch (error) 
    {
        console.error("Get rating error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Failed to get rating",
        });
    }
};

//particular store ratings 
const getStoreRatingsController = async (req, res) => {

    try {
        const ratings = await ratingService.getStoreRatings(req.params.storeId);

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

const getStoreRatingSummaryController = async (req, res) => {

    try {

        const summary = await ratingService.getStoreRatingSummary(req.params.storeId);

        return res.status(200).json({
            success: true,
            data: { summary },
        });

    } 
    catch (error) 
    {
        console.error("Get rating summary error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Failed to get rating summary",
        });

    }
};

module.exports = { createOrUpdateRatingController, getMyRatingController, getStoreRatingsController, getStoreRatingSummaryController };