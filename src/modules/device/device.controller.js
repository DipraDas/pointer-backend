const deviceService = require("./device.service");

const createDevice = async (req, res) => {
    try {
        const localTime = new Date().toLocaleString("en-AU", {
            timeZone: "Australia/Sydney",
        });

        const {
            deviceName,
            serialNumber,
        } = req.body;

        if (!deviceName || !serialNumber) {
            return res.status(400).json({
                success: false,
                message: "Device name and serial number are required",
            });
        }

        const device = await deviceService.createDevice({
            deviceName,
            serialNumber,
            localTime,
        });

        return res.status(201).json({
            success: true,
            message: "Device saved successfully",
            data: device,
        });
    } catch (error) {

        if (error.message === "Device already registered") {
            return res.status(409).json({
                success: false,
                message: "Device already registered",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to save device",
            error: error.message,
        });
    }
};


const getAllDevices = async (req, res) => {
    try {
        const devices = await deviceService.getAllDevices();

        return res.status(200).json({
            success: true,
            message: "Devices fetched successfully",
            count: devices.length,
            data: devices,
        });
    } catch (error) {
        console.log("Get devices error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch devices",
            error: error.message,
        });
    }
};
module.exports = {
    createDevice,
    getAllDevices
};