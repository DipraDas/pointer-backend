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

module.exports = {
  sendNotification,
};