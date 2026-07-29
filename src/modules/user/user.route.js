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

// User
router.get(
    "/users",
    auth,
    authorize("admin"),
    userController.getAllUsers
);

module.exports = router;