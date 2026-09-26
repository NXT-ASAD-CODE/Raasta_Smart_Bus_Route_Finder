const express = require("express");

const {
    getRoutes,
    getRouteById,
    createRoute,
    updateRoute,
    updateRouteTravelTimes,
    deactivateRoute
} = require("../controllers/routeController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", getRoutes);

router.get("/:routeId", getRouteById);

router.post(
    "/",
    adminAuth,
    createRoute
);

router.patch(
    "/:routeId",
    adminAuth,
    updateRoute
);

router.patch(
    "/:routeId/travel-time",
    adminAuth,
    updateRouteTravelTimes
);

router.patch(
    "/:routeId/deactivate",
    adminAuth,
    deactivateRoute
);

module.exports = router;