const express = require("express");

const router = express.Router();

const trackerController =
    require("./tracker.controller");

const auth =
    require("../../middleware/auth");


router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Tracker API is working",
    });
});


router.post(
    "/location",
    trackerController.saveLocation
);


router.get(
    "/latest/:deviceId",
    auth,
    trackerController.getLastDeviceData
);

module.exports = router;