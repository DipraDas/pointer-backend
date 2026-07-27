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

module.exports = {
    signup,
    verifySignupOtp,
    login,
    verifyLoginOtp
};