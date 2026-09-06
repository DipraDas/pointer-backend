require("../../config/firebase");

const {
  getMessaging,
} = require("firebase-admin/messaging");

const sendNotification = async ({
  token,
  title,
  body,
  data = {},
}) => {
  const message = {
    token,

    notification: {
      title,
      body,
    },

    data: Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        String(value),
      ])
    ),

    android: {
      priority: "high",
    },
  };

  const response = await getMessaging().send(message);

  return response;
};

const sendNotificationToUser = async ({
  userId,
  title,
  body,
}) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.fcmTokens || user.fcmTokens.length === 0) {
    throw new Error(
      "No FCM tokens found for this user"
    );
  }

  const results = [];

  for (const device of user.fcmTokens) {

    try {

      const message = {
        token: device.token,

        notification: {
          title: title || "Pointer",
          body: body || "You have a new notification",
        },

        data: {
          type: "general",
        },
      };

      const response =
        await admin.messaging().send(message);

      results.push({
        token: device.token,
        success: true,
        response,
      });

    } catch (error) {

      results.push({
        token: device.token,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
};

module.exports = {
  sendNotification,
  sendNotificationToUser,
};