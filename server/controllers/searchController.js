const {
    searchDirectRoutes,
    searchOneTransferRoutes
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

        // Step 1: Search for direct routes
        const directRoutes = await searchDirectRoutes(
            fromStop,
            toStop
        );

        if (directRoutes.length > 0) {
            return res.status(200).json({
                success: true,
                type: "direct",
                count: directRoutes.length,
                data: directRoutes
            });
        }

        // Step 2: Search for one-transfer routes
        const transferRoutes = await searchOneTransferRoutes(
            fromStop,
            toStop
        );

        return res.status(200).json({
            success: true,
            type: "one-transfer",
            count: transferRoutes.length,
            data: transferRoutes
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchRoutes
};