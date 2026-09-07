const Tracker = require("./tracker.model");
const Device = require("../device/device.model");
const User = require("../user/user.model");


// SAVE LOCATION
const saveLocation = async (req, res) => {
    try {
        const {
            deviceName,
            serialNumber,
            latitude,
            longitude,
            gpsDate,
            gpsTime,
            emergency,
        } = req.body;

        if (!serialNumber) {
            return res.status(400).json({
                success: false,
                message: "Device serial number is required",
            });
        }

        if (
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required",
            });
        }

        // FIND DEVICE
        const device = await Device.findOne({
            serialNumber: serialNumber.trim(),
        });

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found",
            });
        }

        // FIND USER WHO HAS THIS DEVICE
        const user = await User.findOne({
            devices: device._id,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "This device is not associated with any user",
            });
        }

        // SAVE LOCATION
        const location = await Tracker.create({
            device: device._id,
            latitude,
            longitude,
            gpsDate,
            gpsTime,
            emergency: emergency === true || emergency === "true",
        });

        // SEND NOTIFICATION ONLY IF EMERGENCY
        if (
            emergency === true ||
            emergency === "true"
        ) {
            await notificationService.sendNotificationToUser({
                userId: user._id,
                title: "Emergency Alert",
                body: `${deviceName || "Your device"} has triggered an emergency alert.`,
                data: {
                    type: "emergency",
                    deviceId: device._id.toString(),
                    serialNumber: device.serialNumber,
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                },
            });
        }

        return res.status(201).json({
            success: true,
            message: emergency
                ? "Location saved and emergency notification sent"
                : "Location saved successfully",
            data: location,
        });

    } catch (error) {
        console.log(
            "SAVE LOCATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to save location",
            error: error.message,
        });
    }
};

// GET LATEST DEVICE DATA
const getLastDeviceData = async (req, res) => {

    try {

        const { deviceId } = req.params;


        if (!deviceId) {

            return res.status(400).json({
                success: false,
                message: "Device serial number is required",
            });

        }


        // Find latest record for this serial number
        const latestData = await Tracker.findOne({
            serialNumber: deviceId,
        })
        .sort({
            createdAt: -1,
        });


        if (!latestData) {

            return res.status(404).json({
                success: false,
                message: "No tracking data found for this device",
            });

        }
        return res.status(200).json({

            success: true,

            message:
                "Latest device data fetched successfully",

            // RETURN EVERYTHING FROM MONGODB
            data: latestData,

        });


    } catch (error) {

        console.log(
            "GET LAST DEVICE DATA ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to get latest device data",

            error: error.message,

        });

    }

};


module.exports = {
    saveLocation,
    getLastDeviceData,
};