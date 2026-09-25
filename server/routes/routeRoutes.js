const express = require("express");

const {
    getRoutes,
    getRouteById,
    createRoute,
    updateRouteTravelTimes
} = require("../controllers/routeController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", getRoutes);

router.get("/:routeId", getRouteById);

// Admin only
router.post("/", adminAuth, createRoute);

// Admin only
router.patch(
    "/:routeId/travel-time",
    adminAuth,
    updateRouteTravelTimes
);

module.exports = router;