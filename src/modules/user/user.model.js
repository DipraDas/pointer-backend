const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        role: {
            type: String,
            enum: ["admin", "parent"],
            default: "parent",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
        fcmTokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
                platform: {
                    type: String,
                    enum: ["android", "ios"],
                    default: "android",
                },
            },
        ],

    },
    {
        timestamps: true,
    }
);


const User = mongoose.model("User", userSchema);


module.exports = User;