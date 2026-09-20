const mongoose = require("mongoose");
const Stop = require("../models/stop");

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
        if (
            !mongoose.Types.ObjectId.isValid(fromStop) ||
            !mongoose.Types.ObjectId.isValid(toStop)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid stop ID"
            });
        }
        const startingStop = await Stop.findById(fromStop);
        const destinationStop = await Stop.findById(toStop);

        if (!startingStop) {
            return res.status(404).json({
                success: false,
                message: "Starting stop not found"
            });
        }

        if (!destinationStop) {
            return res.status(404).json({
                success: false,
                message: "Destination stop not found"
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