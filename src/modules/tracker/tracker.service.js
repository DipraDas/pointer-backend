const Tracker = require("./tracker.model");

const saveTrackerData = async (data) => {
    const trackerData = await Tracker.create(data);
    return trackerData;
};

module.exports = {
    saveTrackerData,
};