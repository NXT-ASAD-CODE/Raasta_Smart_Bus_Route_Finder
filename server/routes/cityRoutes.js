const express = require("express");

const {
    getCities,
    getCityById,
    createCity,
    updateCity,
    deactivateCity,
    reactivateCity
} = require("../controllers/cityController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Public routes
router.get("/", getCities);
router.get("/:cityId", getCityById);

// Admin-only routes
router.post("/", adminAuth, createCity);

router.patch(
    "/:cityId",
    adminAuth,
    updateCity
);

router.patch(
    "/:cityId/deactivate",
    adminAuth,
    deactivateCity
);

router.patch(
    "/:cityId/reactivate",
    adminAuth,
    reactivateCity
);

module.exports = router;