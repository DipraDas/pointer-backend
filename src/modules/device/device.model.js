const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
    {
        deviceName: {
            type: String,
            required: true,
        },

        serialNumber: {
            type: String,
            required: true,
            unique: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        localTime: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;