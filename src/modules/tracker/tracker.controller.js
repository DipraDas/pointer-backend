const Tracker = require("./tracker.model");


// SAVE LOCATION
const saveLocation = async (req, res) => {
    try {

        const {
            deviceId,
            latitude,
            longitude,
        } = req.body;


        if (
            !deviceId ||
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Device ID, latitude and longitude are required",
            });
        }


        const location = await Tracker.create({
            device: deviceId,
            latitude,
            longitude,
        });


        return res.status(201).json({
            success: true,
            message: "Location saved successfully",
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