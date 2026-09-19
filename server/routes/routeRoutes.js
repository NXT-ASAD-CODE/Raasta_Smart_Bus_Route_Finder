const express = require("express");

const {
    getRoutes,
    getRouteById,
    createRoute
} = require("../controllers/routeController");

const router = express.Router();

// Get all routes
router.get("/", getRoutes);

// Get one route
router.get("/:routeId", getRouteById);

// Create a route
router.post("/", createRoute);

module.exports = router;