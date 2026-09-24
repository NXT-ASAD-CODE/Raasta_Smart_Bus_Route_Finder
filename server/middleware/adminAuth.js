const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
    try {
        const token = req.cookies?.adminToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login first."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.admin = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin session."
        });
    }
};

module.exports = adminAuth;