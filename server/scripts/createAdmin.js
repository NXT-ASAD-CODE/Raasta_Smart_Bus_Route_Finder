require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("../models/admin");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const mobile = process.env.ADMIN_MOBILE;

        if (!email || !password || !mobile) {
            throw new Error(
                "ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_MOBILE are required"
            );
        }

        const existingAdmin = await Admin.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        const admin = await Admin.create({
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            mobile: mobile.trim()
        });

        console.log("================================");
        console.log("Admin created successfully");
        console.log("================================");
        console.log("Admin ID:", admin._id);
        console.log("Admin Email:", admin.email);
        console.log("Admin Mobile:", admin.mobile);
        console.log("================================");

    } catch (error) {
        console.error("Failed to create admin:");
        console.error(error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();