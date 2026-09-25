const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");

/*
|--------------------------------------------------------------------------
| Admin Login
|--------------------------------------------------------------------------
*/

const adminLogin = async (req, res, next) => {
    try {
        const {
            email,
            password,
            mobile
        } = req.body;

        // Check required fields
        if (!email || !password || !mobile) {
            return res.status(400).json({
                success: false,
                message:
                    "Email, password and mobile number are required"
            });
        }

        // Find admin by email
        const admin = await Admin.findOne({
            email: email.toLowerCase().trim()
        });

        // Admin does not exist
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const passwordMatched = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check mobile number
        if (mobile.trim() !== admin.mobile) {
            return res.status(401).json({
                success: false,
                message: "Invalid mobile number"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                adminId: admin._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Store token in HTTP-only cookie
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure:
                process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Admin login successful"
        });

    } catch (error) {
        next(error);
    }
};


/*
|--------------------------------------------------------------------------
| Verify Admin
|--------------------------------------------------------------------------
|
| This route is reached only after adminAuth middleware
| successfully verifies the admin token.
|
*/

const verifyAdmin = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Admin is authenticated",
        admin: req.admin
    });
};


module.exports = {
    adminLogin,
    verifyAdmin
};