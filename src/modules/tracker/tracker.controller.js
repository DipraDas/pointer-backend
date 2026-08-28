const trackerService = require("./tracker.service");

const saveLocation = async (req, res) => {
    try {
        const {
            deviceName,
            serialNumber,
            latitude,
            longitude,
            emergency,
            googleMapsLink,
        } = req.body;

        const now = new Date();

        const sydneyDate = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Australia/Sydney",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(now);

        const sydneyTime = new Intl.DateTimeFormat("en-AU", {
            timeZone: "Australia/Sydney",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(now);

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
            serialNumber,
            latitude,
            longitude,
            gpsDate: sydneyDate,
            gpsTime: sydneyTime,
            emergency: emergency || false,
            googleMapsLink,
        });

        console.log("TRACKER DATA SAVED");
        console.log("------------------");

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