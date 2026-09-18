const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        country: {
            type: String,
            default: "Pakistan",
            trim: true
        },

        province: {
            type: String,
            trim: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const City = mongoose.model("City", citySchema);

module.exports = City;