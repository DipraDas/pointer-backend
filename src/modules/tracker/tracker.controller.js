const Tracker = require("./tracker.model");

const Device = require("../device/device.model");

const User = require("../user/user.model");

const notificationService =
    require("../notification/notification.service");



// ==========================================
// SAVE LOCATION
// ==========================================

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


        // ======================================
        // VALIDATION
        // ======================================

        if (!serialNumber) {

            return res.status(400).json({

                success: false,

                message:
                    "Device serial number is required",

            });

        }


        if (
            latitude === undefined ||
            longitude === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Latitude and longitude are required",

            });

        }


        // ======================================
        // FIND DEVICE
        // ======================================

        const device = await Device.findOne({

            serialNumber:
                serialNumber.trim(),

        });


        if (!device) {

            return res.status(404).json({

                success: false,

                message:
                    "Device not found",

            });

        }


        // ======================================
        // FIND USER WHO OWNS DEVICE
        // ======================================

        const user = await User.findOne({

            devices:
                device._id,

        });


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "This device is not associated with any user",

            });

        }


        // ======================================
        // EMERGENCY BOOLEAN
        // ======================================

        const isEmergency =
            emergency === true ||
            emergency === "true";


        // ======================================
        // SAVE TRACKING DATA
        // ======================================

        const location =
            await Tracker.create({

                // Mongo device reference
                device:
                    device._id,

                // IMPORTANT
                // save serial number too
                serialNumber:
                    device.serialNumber,

                latitude,

                longitude,

                gpsDate,

                gpsTime,

                emergency:
                    isEmergency,

            });


        console.log(
            "LOCATION SAVED:",
            location
        );


        // ======================================
        // SEND EMERGENCY NOTIFICATION
        // ======================================

        if (isEmergency) {

            try {

                await notificationService
                    .sendNotificationToUser({

                        userId:
                            user._id,

                        title:
                            "Emergency Alert",

                        body:
                            `${
                                deviceName ||
                                device.deviceName ||
                                "Your device"
                            } has triggered an emergency alert.`,

                        data: {

                            type:
                                "emergency",

                            deviceId:
                                device._id.toString(),

                            serialNumber:
                                device.serialNumber,

                            latitude:
                                latitude.toString(),

                            longitude:
                                longitude.toString(),

                        },

                    });


                console.log(
                    "EMERGENCY NOTIFICATION SENT"
                );


            } catch (
                notificationError
            ) {

                // Do not fail location saving
                // just because notification failed

                console.log(
                    "NOTIFICATION ERROR:",
                    notificationError
                );

            }

        }


        // ======================================
        // SUCCESS
        // ======================================

        return res.status(201).json({

            success: true,

            message:
                isEmergency
                    ? "Location saved and emergency processed"
                    : "Location saved successfully",

            data:
                location,

        });


    } catch (error) {


        console.log(
            "SAVE LOCATION ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to save location",

            error:
                error.message,

        });

    }

};



// ==========================================
// GET LATEST DEVICE DATA
// ==========================================

const getLastDeviceData = async (
    req,
    res
) => {

    try {

        const {
            deviceId
        } = req.params;


        if (!deviceId) {

            return res.status(400).json({

                success: false,

                message:
                    "Device serial number is required",

            });

        }


        // ======================================
        // FIND LATEST DATA USING SERIAL NUMBER
        // ======================================

        const latestData =
            await Tracker.findOne({

                serialNumber:
                    deviceId.trim(),

            })
            .sort({

                createdAt:
                    -1,

            });


        if (!latestData) {

            return res.status(404).json({

                success: false,

                message:
                    "No tracking data found for this device",

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Latest device data fetched successfully",

            data:
                latestData,

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

            error:
                error.message,

        });

    }

};



module.exports = {

    saveLocation,

    getLastDeviceData,

};