const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../../utils/jwt");

const User = require("./user.model");
const OTP = require("../otp/otp.model");

const generateOtp = require("../../utils/generateOtp");
const sendEmail = require("../../utils/sendEmail");

const signup = async (payload) => {

    const { name, email, password } = payload;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    await OTP.deleteMany({
        email,
        purpose: "signup",
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();

    await OTP.create({
        email,
        otp,
        purpose: "signup",
        data: {
            name,
            password: hashedPassword,
        },
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmail(
        email,
        "Email Verification",
        `Your verification code is ${otp}`
    );

    return {
        email,
    };
};

const verifySignupOtp = async (payload) => {

    const { email, otp } = payload;

    const otpData = await OTP.findOne({
        email,
        purpose: "signup",
    });

    if (!otpData) {
        throw new Error("OTP expired or not found.");
    }

    if (otpData.otp !== otp) {
        throw new Error("Invalid OTP.");
    }

    const user = await User.create({
        name: otpData.data.name,
        email,
        password: otpData.data.password,
        role: "parent",
        isVerified: true,
    });

    await OTP.deleteOne({
        _id: otpData._id,
    });

    const accessToken = generateAccessToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    return {
        accessToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

const login = async (payload) => {

    const { email, password } = payload;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatched) {
        throw new Error("Invalid email or password.");
    }

    if (!user.isVerified) {
        throw new Error("Please verify your account.");
    }

    if (!user.isActive) {
        throw new Error("Account is inactive.");
    }

    const otp = generateOtp();

    await OTP.deleteMany({
        email,
        purpose: "login",
    });

    await OTP.create({
        email,
        otp,
        purpose: "login",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmail(
        email,
        "Login Verification",
        `Your login OTP is ${otp}`
    );

    return {
        email,
    };
};

const verifyLoginOtp = async (payload) => {

    const { email, otp } = payload;

    const otpData = await OTP.findOne({
        email,
        purpose: "login",
    });

    if (!otpData) {
        throw new Error("OTP expired.");
    }

    if (otpData.otp !== otp) {
        throw new Error("Invalid OTP.");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found.");
    }

    await OTP.deleteOne({
        _id: otpData._id,
    });

    const accessToken = generateAccessToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    return {
        accessToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

const getAllUsers = async () => {

    const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

    return users;

};

module.exports = {
    signup,
    verifySignupOtp,
    login,
    verifyLoginOtp,
    getAllUsers,
};