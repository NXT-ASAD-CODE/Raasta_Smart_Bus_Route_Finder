const {
    searchDirectRoutes
} = require("../services/routeSearchService");

const searchRoutes = async (req, res, next) => {
    try {
        const { fromStop, toStop } = req.body;

        if (!fromStop || !toStop) {
            return res.status(400).json({
                success: false,
                message: "fromStop and toStop are required"
            });
        }

        if (fromStop === toStop) {
            return res.status(400).json({
                success: false,
                message: "Starting stop and destination stop cannot be the same"
            });
        }

        const results = await searchDirectRoutes(
            fromStop,
            toStop
        );

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchRoutes
};