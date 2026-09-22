const express = require("express");

const {
    getRoutes,
    getRouteById,
    createRoute,
    updateRouteTravelTimes
} = require("../controllers/routeController");

const router = express.Router();

// Get all routes
router.get("/", getRoutes);

// Get one route
router.get("/:routeId", getRouteById);

// Create a route
router.post("/", createRoute);

// Update travel times
router.patch(
    "/:routeId/travel-time",
    updateRouteTravelTimes
);

module.exports = router;