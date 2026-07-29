const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {

        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access.",
            });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing.",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });

    }
};

module.exports = auth;