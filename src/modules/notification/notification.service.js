require("../../config/firebase");

const User = require("../user/user.model");

const {
  getMessaging,
} = require("firebase-admin/messaging");


// ======================================================
// SEND TO A SINGLE TOKEN
// ======================================================

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
      Object.entries(data).map(
        ([key, value]) => [
          key,
          String(value),
        ]
      )
    ),

    android: {
      priority: "high",

      notification: {
        channelId: "default",
        priority: "high",
      },
    },

  };


  const response =
    await getMessaging().send(message);


  return response;
};


// ======================================================
// SEND TO USER
// ======================================================

const sendNotificationToUser = async ({
  userId,
  title,
  body,
  data = {},
}) => {

  const user =
    await User.findById(userId);


  if (!user) {

    throw new Error(
      "User not found"
    );

  }


  if (
    !user.fcmTokens ||
    user.fcmTokens.length === 0
  ) {

    throw new Error(
      "No FCM tokens found for this user"
    );

  }


  console.log(
    "========================================"
  );

  console.log(
    "SENDING NOTIFICATION TO:",
    user.email
  );

  console.log(
    "TOTAL FCM TOKENS:",
    user.fcmTokens.length
  );

  console.log(
    "========================================"
  );


  const results = [];

  const invalidTokens = [];


  for (const device of user.fcmTokens) {

    const token =
      typeof device === "string"
        ? device
        : device?.token;


    if (!token) {

      continue;

    }


    try {

      const message = {

        token,

        notification: {

          title:
            title || "Pointer",

          body:
            body ||
            "You have a new notification",

        },


        data: Object.fromEntries(
          Object.entries(data).map(
            ([key, value]) => [
              key,
              String(value),
            ]
          )
        ),


        android: {

          priority: "high",

          notification: {

            channelId:
              "default",

            priority:
              "high",

          },

        },

      };


      const response =
        await getMessaging().send(
          message
        );


      console.log(
        "✅ NOTIFICATION SUCCESS:",
        token.substring(0, 20) + "..."
      );


      results.push({

        token,

        success: true,

        response,

      });


    } catch (error) {

      console.log(
        "❌ NOTIFICATION FAILED:",
        error.code,
        error.message
      );


      // FCM TOKEN IS OLD / INVALID
      if (
        error.code ===
          "messaging/registration-token-not-registered" ||

        error.message
          ?.toLowerCase()
          ?.includes("notregistered")
      ) {

        invalidTokens.push(
          token
        );

      }


      results.push({

        token,

        success: false,

        error:
          error.message,

      });

    }

  }


  // ======================================================
  // REMOVE OLD TOKENS
  // ======================================================

  if (invalidTokens.length > 0) {

    user.fcmTokens =
      user.fcmTokens.filter(
        item => {

          const token =
            typeof item === "string"
              ? item
              : item?.token;

          return !invalidTokens.includes(
            token
          );

        }
      );


    await user.save();


    console.log(
      "🗑 Removed invalid FCM tokens:",
      invalidTokens.length
    );

  }


  return results;
};


module.exports = {

  sendNotification,

  sendNotificationToUser,

};