const trackerService = require("./tracker.service");

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
            googleMapsLink,
        } = req.body;

        if (
            !deviceName ||
            !serialNumber ||
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Required tracker data is missing",
            });
        }

        const data = await trackerService.saveTrackerData({
            deviceName,
            serialNumber,
            latitude,
            longitude,
            gpsDate,
            gpsTime,
            emergency: emergency || false,
            googleMapsLink,
        });

        console.log("TRACKER DATA SAVED");

        return res.status(201).json({
            success: true,
            message: "Tracker data saved successfully",
            data,
        });
    } catch (error) {
        console.log("Tracker save error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save tracker data",
            error: error.message,
        });
    }
};

module.exports = {
    saveLocation,
};