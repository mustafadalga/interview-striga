const mongoose = require("mongoose");
const { env } = require("../constants");

async function connectDB () {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(env.MONGODB_URL);
            console.log("MongoDB connected");
        }
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

module.exports = connectDB