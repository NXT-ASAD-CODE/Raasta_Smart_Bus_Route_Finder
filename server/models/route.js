const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
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

        routeNumber: {
            type: String,
            required: true,
            trim: true
        },

        startPoint: {
            type: String,
            required: true,
            trim: true
        },

        endPoint: {
            type: String,
            required: true,
            trim: true
        },

        stops: [
            {
                stop: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Stop",
                    required: true
                },

                sequence: {
                    type: Number,
                    required: true
                }
            }
        ],

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;