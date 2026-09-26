const express = require("express");

const {
    getCities,
    getCityById,
    createCity,
    updateCity
} = require("../controllers/cityController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", getCities);

router.get("/:cityId", getCityById);

router.post("/", adminAuth, createCity);

router.patch(
    "/:cityId",
    adminAuth,
    updateCity
);

module.exports = router;