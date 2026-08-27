const Device = require("./device.model");

const createDevice = async (data) => {
    const existingDevice = await Device.findOne({
        serialNumber: data.serialNumber,
    });

    if (existingDevice) {
        throw new Error("Device already registered");
    }

    return await Device.create(data);
};

const getAllDevices = async () => {
    return await Device.find().sort({
        createdAt: -1,
    });
};

module.exports = {
    createDevice,
    getAllDevices,
};