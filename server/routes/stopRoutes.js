const express = require("express");

const {
    getStops,
    getStopById,
    createStop
} = require("../controllers/stopController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", getStops);

router.get("/:stopId", getStopById);

// Admin only
router.post("/", adminAuth, createStop);

module.exports = router;