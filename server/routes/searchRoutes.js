const express = require("express");

const {
    searchRoutes
} = require("../controllers/searchController");

const router = express.Router();

router.post("/", searchRoutes);

module.exports = router;