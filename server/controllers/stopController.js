const Stop = require("../models/stop");

// Get all active stops
const getStops = async (req, res, next) => {
    try {
        const stops = await Stop.find({ isActive: true })
            .populate("city", "name slug")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: stops,
            count: stops.length
        });
    } catch (error) {
        next(error);
    }
};

// Get one stop
const getStopById = async (req, res, next) => {
    try {
        const stop = await Stop.findById(req.params.stopId)
            .populate("city", "name slug");

        if (!stop) {
            return res.status(404).json({
                success: false,
                message: "Stop not found"
            });
        }

        res.status(200).json({
            success: true,
            data: stop
        });
    } catch (error) {
        next(error);
    }
};

// Create a stop
const createStop = async (req, res, next) => {
    try {
        const {
            city,
            name,
            nameUrdu,
            location,
            landmarks
        } = req.body;

        if (!city || !name || !location?.coordinates) {
            return res.status(400).json({
                success: false,
                message: "City, name and coordinates are required"
            });
        }

        const stop = await Stop.create({
            city,
            name,
            nameUrdu,
            location,
            landmarks
        });

        const populatedStop = await stop.populate(
            "city",
            "name slug"
        );

        res.status(201).json({
            success: true,
            data: populatedStop
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStops,
    getStopById,
    createStop
};