const mongoose = require("mongoose");

const trackerSchema = new mongoose.Schema(
    {
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            required: true,
        },

        latitude: {
            type: Number,
            required: true,
        },

        longitude: {
            type: Number,
            required: true,
        },

        speed: {
            type: Number,
            default: 0,
        },

        battery: {
            type: Number,
            default: null,
        },

        status: {
            type: String,
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model(
        "Tracker",
        trackerSchema
    );