const express = require("express");

const {
    getStops,
    getStopById,
    createStop,
    updateStop,
    deactivateStop,
    reactivateStop
} = require("../controllers/stopController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// =========================
// Public routes
// =========================

router.get("/", getStops);

router.get(
    "/:stopId",
    getStopById
);


// =========================
// Admin routes
// =========================

router.post(
    "/",
    adminAuth,
    createStop
);

router.patch(
    "/:stopId",
    adminAuth,
    updateStop
);

router.patch(
    "/:stopId/deactivate",
    adminAuth,
    deactivateStop
);

router.patch(
    "/:stopId/reactivate",
    adminAuth,
    reactivateStop
);

module.exports = router;