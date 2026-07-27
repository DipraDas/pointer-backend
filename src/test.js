require("dotenv").config();

const connectDB = require("./config/db");

const User = require("./modules/user/user.model");


async function test(){

    await connectDB();


    const user = await User.create({
        name:"Test User",
        email:"test@gmail.com",
        password:"hashed_password",
        // role:"student"
    });


    console.log(user);

}


test();