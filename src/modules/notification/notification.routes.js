const express = require("express");

const router = express.Router();

const notificationController =
  require("./notification.controller");

const auth = require("../../middleware/auth");


router.post(
  "/send",
  auth,
  notificationController.sendNotificationToUser
);

module.exports = router;