const express = require("express");

const {
    getCities,
    getCityById,
    createCity
} = require("../controllers/cityController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", getCities);

router.get("/:cityId", getCityById);

// Admin only
router.post("/", adminAuth, createCity);

module.exports = router;