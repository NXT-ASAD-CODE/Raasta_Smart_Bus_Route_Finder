const Route = require("../models/route");

// Get all active routes
const getRoutes = async (req, res, next) => {
    try {
        const routes = await Route.find({ isActive: true })
            .populate("city", "name slug")
            .populate("stops.stop", "name nameUrdu location")
            .sort({ routeNumber: 1 });

        res.status(200).json({
            success: true,
            data: routes,
            count: routes.length
        });
    } catch (error) {
        next(error);
    }
};


// Get one route
const getRouteById = async (req, res, next) => {
    try {
        const route = await Route.findById(req.params.routeId)
            .populate("city", "name slug")
            .populate("stops.stop", "name nameUrdu location");

        if (!route) {
            return res.status(404).json({
                success: false,
                message: "Route not found"
            });
        }

        res.status(200).json({
            success: true,
            data: route
        });
    } catch (error) {
        next(error);
    }
};


// Create a route
const createRoute = async (req, res, next) => {
    try {
        const {
            city,
            name,
            routeNumber,
            startPoint,
            endPoint,
            stops
        } = req.body;

        if (
            !city ||
            !name ||
            !routeNumber ||
            !startPoint ||
            !endPoint ||
            !stops ||
            stops.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "City, name, route number, start point, end point and stops are required"
            });
        }

        const route = await Route.create({
            city,
            name,
            routeNumber,
            startPoint,
            endPoint,
            stops
        });

        const populatedRoute = await route.populate([
            {
                path: "city",
                select: "name slug"
            },
            {
                path: "stops.stop",
                select: "name nameUrdu location"
            }
        ]);

        res.status(201).json({
            success: true,
            data: populatedRoute
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getRoutes,
    getRouteById,
    createRoute
};