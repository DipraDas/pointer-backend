const mongoose = require("mongoose");


const connectDB = async () => {
    try {

        console.log("Connecting to MongoDB...");
        console.log(process.env.DATABASE_URL);

        await mongoose.connect(process.env.DATABASE_URL);

        console.log("MongoDB connected");

    } catch(error){

        console.log("Database connection failed");
        console.log(error.message);

        process.exit(1);
    }
};


module.exports = connectDB;