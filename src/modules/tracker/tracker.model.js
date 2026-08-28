const mongoose = require("mongoose");

const trackerSchema = new mongoose.Schema(
    {
        deviceName: {
            type: String,
            required: false,
        },

        serialNumber: {
            type: String,
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

        gpsDate: {
            type: String,
        },

        gpsTime: {
            type: String,
        },

        emergency: {
            type: Boolean,
            default: false,
        },

        googleMapsLink: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Tracker = mongoose.model("Tracker", trackerSchema);

module.exports = Tracker;