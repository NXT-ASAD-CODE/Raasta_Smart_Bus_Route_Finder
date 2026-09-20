const mongoose = require("mongoose");
const dotenv = require("dotenv");

const City = require("../models/city");
const Stop = require("../models/stop");
const Route = require("../models/route");

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        // Remove old test data
        await Route.deleteMany({});
        await Stop.deleteMany({});
        await City.deleteMany({});

        console.log("Old data cleared");

        // =========================
        // CREATE CITY
        // =========================

        const karachi = await City.create({
            name: "Karachi",
            slug: "karachi",
            country: "Pakistan",
            province: "Sindh"
        });

        console.log("Karachi created");

        // =========================
        // CREATE STOPS
        // =========================

        const stops = await Stop.insertMany([
            {
                city: karachi._id,

                name: "NIPA",

                nameUrdu: "نیپا",

                location: {
                    type: "Point",
                    coordinates: [67.0976, 24.9180]
                },

                landmarks: [
                    "NIPA Chowrangi"
                ]
            },

            {
                city: karachi._id,

                name: "Hasan Square",

                nameUrdu: "حسن اسکوائر",

                location: {
                    type: "Point",
                    coordinates: [67.0870, 24.9115]
                },

                landmarks: [
                    "Hasan Square"
                ]
            },

            {
                city: karachi._id,

                name: "Civic Centre",

                nameUrdu: "سوک سینٹر",

                location: {
                    type: "Point",
                    coordinates: [67.0800, 24.9000]
                },

                landmarks: [
                    "Civic Centre"
                ]
            },

            {
                city: karachi._id,

                name: "Gulshan Stop",

                nameUrdu: "گلشن اسٹاپ",

                location: {
                    type: "Point",
                    coordinates: [67.0950, 24.9050]
                },

                landmarks: [
                    "Gulshan-e-Iqbal"
                ]
            }
        ]);

        console.log(`${stops.length} stops created`);

        // =========================
        // FIND STOPS
        // =========================

        const nipa = stops.find(
            (stop) => stop.name === "NIPA"
        );

        const hasanSquare = stops.find(
            (stop) => stop.name === "Hasan Square"
        );

        const civicCentre = stops.find(
            (stop) => stop.name === "Civic Centre"
        );

        const gulshanStop = stops.find(
            (stop) => stop.name === "Gulshan Stop"
        );

        // =========================
        // CREATE ROUTES
        // =========================

        await Route.create([
            {
                city: karachi._id,

                name: "NIPA to Civic Centre",

                routeNumber: "TEST-01",

                startPoint: "NIPA",

                endPoint: "Civic Centre",

                stops: [
                    {
                        stop: nipa._id,
                        sequence: 1
                    },
                    {
                        stop: hasanSquare._id,
                        sequence: 2
                    },
                    {
                        stop: civicCentre._id,
                        sequence: 3
                    }
                ]
            },

            {
                city: karachi._id,

                name: "Civic Centre to Gulshan Stop",

                routeNumber: "TEST-02",

                startPoint: "Civic Centre",

                endPoint: "Gulshan Stop",

                stops: [
                    {
                        stop: civicCentre._id,
                        sequence: 1
                    },
                    {
                        stop: gulshanStop._id,
                        sequence: 2
                    }
                ]
            }
        ]);

        console.log("Routes created");

        console.log("");
        console.log("=================================");
        console.log("Raasta database seeded successfully");
        console.log("=================================");

        // Close MongoDB connection
        await mongoose.connection.close();

        process.exit(0);

    } catch (error) {
        console.error("Seed Error:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedDatabase();