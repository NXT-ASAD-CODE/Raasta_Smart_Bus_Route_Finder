const express = require("express");

const {
    getStops,
    getStopById,
    createStop
} = require("../controllers/stopController");

const router = express.Router();

router.get("/", getStops);
router.get("/:stopId", getStopById);
router.post("/", createStop);

module.exports = router;