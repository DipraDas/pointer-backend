const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "School API Running"
    });
});

const userRoutes = require("./modules/user/user.route");
const trackerRoutes = require("./modules/tracker/tracker.route");
const deviceRoutes = require("./modules/device/device.route");

app.use("/api/users", userRoutes);
app.use("/api/tracker", trackerRoutes);
app.use("/api/devices", deviceRoutes);


module.exports = app;