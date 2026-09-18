const express = require("express");

const {
    getCities,
    getCityById,
    createCity
} = require("../controllers/cityController");

const router = express.Router();

router.get("/", getCities);
router.get("/:cityId", getCityById);
router.post("/", createCity);

module.exports = router;