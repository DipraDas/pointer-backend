const BlacklistedToken = require("../blacklistedToken/blacklistedToken.model");
const userService = require("./user.service");

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

module.exports = {
    signup,
    verifySignupOtp,
    login,
    verifyLoginOtp,
    getAllUsers,
    logout,
    changePassword,
    addDeviceToUser,
};