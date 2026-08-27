const express = require("express");
const userController = require("./user.controller");
const auth = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");

const router = express.Router();

// Account
router.post("/signup", userController.signup);

router.post("/verify-signup-otp", userController.verifySignupOtp);

router.post("/login", userController.login);

router.post("/verify-login-otp", userController.verifyLoginOtp);
// router.post("/resend-otp", userController.resendOtp);
router.post("/logout", auth, userController.logout);
router.post("/change-password", auth, userController.changePassword);
// User
router.get("/getAllParents", auth, authorize("admin"), userController.getAllUsers);
router.post("/add-device",auth,userController.addDeviceToUser);


module.exports = router;