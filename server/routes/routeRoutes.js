const express = require("express");

const {
    getRoutes,
    getRouteById,
    createRoute,
    updateRouteTravelTimes
} = require("../controllers/routeController");

const router = express.Router();

router.get("/", getRoutes);

router.get("/:routeId", getRouteById);

router.post("/", createRoute);

router.patch(
    "/:routeId/travel-time",
    updateRouteTravelTimes
);

module.exports = router;