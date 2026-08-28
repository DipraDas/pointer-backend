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
const notificationRoutes = require("./modules/notification/notification.routes");

app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
module.exports = app;