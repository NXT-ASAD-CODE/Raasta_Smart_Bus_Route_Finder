const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");

const adminLogin = async (req, res, next) => {
    try {
        const {
            email,
            password,
            mobile
        } = req.body;
        const verifyAdmin = async (req, res) => {
            return res.status(200).json({
                success: true,
                message: "Admin is authenticated",
                admin: req.admin
            });
        };

        if (!email || !password || !mobile) {
            return res.status(400).json({
                success: false,
                message:
                    "Email, password and mobile number are required"
            });
        }

        const admin = await Admin.findOne({
            email: email.toLowerCase().trim()
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatched =
            await bcrypt.compare(
                password,
                admin.password
            );

        if (!passwordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (mobile.trim() !== admin.mobile) {
            return res.status(401).json({
                success: false,
                message: "Invalid mobile number"
            });
        }

        const token = jwt.sign(
            {
                adminId: admin._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
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

module.exports = {
    adminLogin,
    verifyAdmin
};