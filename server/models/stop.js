const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema(
    {
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        nameUrdu: {
            type: String,
            trim: true
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },

            coordinates: {
                type: [Number],
                required: true
            }
        },

        landmarks: {
            type: [String],
            default: []
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

// Allows nearby-stop searches later
stopSchema.index({
    location: "2dsphere"
});

const Stop = mongoose.model("Stop", stopSchema);

module.exports = Stop;