const express = require("express");

const {
    getStops,
    getStopById,
    createStop,
    updateStop,
    deactivateStop
} = require("../controllers/stopController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", getStops);

router.get("/:stopId", getStopById);

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

module.exports = router;