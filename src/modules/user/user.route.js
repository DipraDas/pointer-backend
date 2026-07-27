const express = require("express");
const userController = require("./user.controller");

const router = express.Router();

router.post("/signup", userController.signup);

router.post("/verify-signup-otp", userController.verifySignupOtp);

router.post("/login", userController.login);

router.post("/verify-login-otp", userController.verifyLoginOtp);
// router.post("/resend-otp", userController.resendOtp);

module.exports = router;