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
        const mobileNumber = process.env.ADMIN_MOBILE;

        if (!email || !password || !mobileNumber) {
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
            mobileNumber: mobileNumber.trim()
        });

        console.log("Admin created successfully");
        console.log("Admin ID:", admin._id);

    } catch (error) {
        console.error("Failed to create admin:");
        console.error(error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();