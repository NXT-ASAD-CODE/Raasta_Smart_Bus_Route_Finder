const express = require("express");

const {
    getStops,
    getStopById,
    createStop,
    updateStop
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

module.exports = router;