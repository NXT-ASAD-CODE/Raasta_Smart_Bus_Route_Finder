const Stop = require("../models/stop");

const {
    searchDirectRoutes,
    searchOneTransferRoutes
} = require("../services/routeSearchService");

/*
|--------------------------------------------------------------------------
| Search for a route between two stops
|--------------------------------------------------------------------------
|
| POST /api/search
| Body: { fromStop, toStop }
|
| Tries a direct route first. If none is found, falls back to a
| one-transfer route.
|
*/
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
                message:
                    "Starting point and destination cannot be the same"
            });
        }

        // Both stops must belong to the same city, so use
        // the starting stop's city to scope the search.
        const startingStop = await Stop.findById(fromStop);

        if (!startingStop) {
            return res.status(404).json({
                success: false,
                message: "Starting stop not found"
            });
        }

        const cityId = startingStop.city;

        const directResults = await searchDirectRoutes(
            fromStop,
            toStop,
            cityId
        );

        if (directResults.length > 0) {
            return res.status(200).json({
                success: true,
                type: "direct",
                data: directResults
            });
        }

        const transferResults = await searchOneTransferRoutes(
            fromStop,
            toStop,
            cityId
        );

        return res.status(200).json({
            success: true,
            type: "one-transfer",
            data: transferResults
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchRoutes
};