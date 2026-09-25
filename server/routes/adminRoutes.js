const express = require("express");

const {
    adminLogin,
    verifyAdmin
} = require("../controllers/adminController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();
router.post("/login", adminLogin);

router.get(
    "/verify",
    adminAuth,
    verifyAdmin
);

module.exports = router;