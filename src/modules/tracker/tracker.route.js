const express = require("express");

const router = express.Router();

const trackerController = require("./tracker.controller");

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

module.exports = router;