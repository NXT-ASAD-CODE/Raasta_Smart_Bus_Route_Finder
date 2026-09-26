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
                message:
                    "City, name, route number, start point, end point and stops are required"
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


// Update travel times for a route
const updateRouteTravelTimes = async (
    req,
    res,
    next
) => {
    try {
        const { routeId } = req.params;
        const { stops } = req.body;

        if (!stops || !Array.isArray(stops)) {
            return res.status(400).json({
                success: false,
                message:
                    "stops array is required"
            });
        }

        const route = await Route.findById(
            routeId
        );

        if (!route) {
            return res.status(404).json({
                success: false,
                message: "Route not found"
            });
        }

        for (const updateStop of stops) {
            const routeStop = route.stops.find(
                (item) =>
                    item.stop.toString() ===
                    updateStop.stop.toString()
            );

            if (!routeStop) {
                continue;
            }

            routeStop.travelTime =
                updateStop.travelTime || 0;
        }

        await route.save();

        const populatedRoute =
            await Route.findById(routeId)
                .populate(
                    "city",
                    "name slug"
                )
                .populate(
                    "stops.stop",
                    "name nameUrdu location"
                );

        res.status(200).json({
            success: true,
            message:
                "Route travel times updated successfully",
            data: populatedRoute
        });
    } catch (error) {
        next(error);
    }
};
// Update route
const updateRoute = async (req, res, next) => {
    try {
        const { routeId } = req.params;

        const {
            city,
            name,
            routeNumber,
            startPoint,
            endPoint,
            stops,
            isActive
        } = req.body;

        const route = await Route.findById(routeId);

        if (!route) {
            return res.status(404).json({
                success: false,
                message: "Route not found"
            });
        }

        if (city !== undefined) {
            route.city = city;
        }

        if (name !== undefined) {
            route.name = name.trim();
        }

        if (routeNumber !== undefined) {
            route.routeNumber = routeNumber.trim();
        }

        if (startPoint !== undefined) {
            route.startPoint = startPoint.trim();
        }

        if (endPoint !== undefined) {
            route.endPoint = endPoint.trim();
        }

        if (stops !== undefined) {
            if (!Array.isArray(stops) || stops.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Stops must be a non-empty array"
                });
            }

            route.stops = stops;
        }

        if (isActive !== undefined) {
            route.isActive = isActive;
        }

        await route.save();

        const populatedRoute = await Route.findById(routeId)
            .populate("city", "name slug")
            .populate(
                "stops.stop",
                "name nameUrdu location"
            );

        res.status(200).json({
            success: true,
            message: "Route updated successfully",
            data: populatedRoute
        });
    } catch (error) {
        next(error);
    }
};
// Deactivate route
const deactivateRoute = async (req, res, next) => {
    try {
        const { routeId } = req.params;

        const route = await Route.findById(routeId);

        if (!route) {
            return res.status(404).json({
                success: false,
                message: "Route not found"
            });
        }

        route.isActive = false;

        await route.save();

        const populatedRoute = await Route.findById(routeId)
            .populate("city", "name slug")
            .populate(
                "stops.stop",
                "name nameUrdu location"
            );

        res.status(200).json({
            success: true,
            message: "Route deactivated successfully",
            data: populatedRoute
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getRoutes,
    getRouteById,
    createRoute,
    updateRoute,
    updateRouteTravelTimes,
    deactivateRoute
};