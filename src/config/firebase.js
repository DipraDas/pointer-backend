const { initializeApp, cert, getApps } = require("firebase-admin/app");

const serviceAccount = require("./firebase-service-account.json");

const firebaseApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

module.exports = firebaseApp;