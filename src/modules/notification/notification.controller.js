const User = require("../user/user.model");
const notificationService = require("./notification.service");

const sendNotificationToUser = async (req, res) => {
  try {
    const { userId, title, body } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: "Title and body are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.fcmTokens || user.fcmTokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User has no registered devices",
      });
    }

    const results = [];

    for (const device of user.fcmTokens) {
      try {
        const response =
          await notificationService.sendNotification({
            token: device.token,
            title,
            body,
            data: {
              userId: user._id.toString(),
            },
          });

        results.push({
          token: device.token,
          success: true,
          response,
        });

      } catch (error) {
        console.error(
          "Notification failed:",
          error.message
        );

        results.push({
          token: device.token,
          success: false,
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Notification sending completed",
      data: results,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send notification",
    });
  }
};

module.exports = {
  sendNotificationToUser,
};