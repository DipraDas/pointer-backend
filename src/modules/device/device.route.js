const express = require("express");

const router = express.Router();

const deviceController = require("./device.controller");

router.post(
    "/",
    deviceController.createDevice
);

router.get(
    "/",
    deviceController.getAllDevices
);

module.exports = router;