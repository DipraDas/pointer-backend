const BlacklistedToken = require("../blacklistedToken/blacklistedToken.model");
const userService = require("./user.service");
const User = require("./user.model");

const signup = async (req, res) => {

    try {

        const result = await userService.signup(req.body);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
            data: result,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

const verifySignupOtp = async (req, res) => {

    try {

        const result = await userService.verifySignupOtp(req.body);

        res.status(200).json({
            success: true,
            message: "Account verified successfully.",
            data: result,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

const login = async (req, res) => {

    try {

        const result = await userService.login(req.body);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
            data: result,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

const verifyLoginOtp = async (req, res) => {

    try {

        const result = await userService.verifyLoginOtp(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            data: result,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

const getAllUsers = async (req, res) => {

    try {

        const users = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully.",
            data: users,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const logout = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    await BlacklistedToken.create({
        token,
        expiresAt: new Date(req.user.exp * 1000),
    });

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};

const changePassword = async (req, res) => {
    try {

        const {
            oldPassword,
            newPassword,
            confirmPassword,
        } = req.body;


        const result = await userService.changePasswordService(
            req.user.id,
            oldPassword,
            newPassword,
            confirmPassword
        );


        return res.status(200).json({
            success: true,
            message: result.message,
        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const saveDeviceToken = async (req, res) => {
  try {
    const userId = req.user.id;

    const { token, platform } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyExists = user.fcmTokens.some(
      item => item.token === token
    );

    if (!alreadyExists) {
      user.fcmTokens.push({
        token,
        platform: platform || "android",
      });

      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Device token saved successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save device token",
    });
  }
};

const addDeviceToUser = async (req, res) => {
    try {
        const {
            email,
            serialNumber,
        } = req.body;

        const result =
            await userService.addDeviceToUser(
                email,
                serialNumber
            );

        console.log("================================");
        console.log("DEVICE ASSIGNED TO USER");
        console.log("User:", email);
        console.log("Device:", serialNumber);
        console.log("================================");

        return res.status(200).json({
            success: true,
            message:
                "Device added to user successfully.",
            data: result,
        });

    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {

        console.log("================================");
        console.log("GET CURRENT USER");
        console.log("REQ USER:", req.user);


        // auth middleware should put user information in req.user
        const userId =
            req.user?._id ||
            req.user?.id ||
            req.user?.userId;


        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user",
            });
        }


        // Find user and populate connected devices
        const user = await User.findById(userId)
            .select("-password")
            .populate("devices");


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }


        console.log("User:", user.email);

        console.log(
            "Devices:",
            user.devices
        );

        console.log("================================");


        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user,
        });


    } catch (error) {

        console.log(
            "GET CURRENT USER ERROR:",
            error
        );


        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: error.message,
        });
    }
};

module.exports = {
    signup,
    verifySignupOtp,
    login,
    verifyLoginOtp,
    getAllUsers,
    logout,
    changePassword,
    saveDeviceToken,
    addDeviceToUser,
    getCurrentUser
};