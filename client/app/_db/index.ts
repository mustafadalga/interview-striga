import mongoose from "mongoose";
import { env } from "@/_constants";

let isConnected = false;

export async function connectDB() {
    if (isConnected) {
        return; // Use existing connection
    }

    try {

        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(env.MONGODB_URL);
            console.log("MongoDB connected");
        }

        isConnected = true;

    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error; // Propagate error to stop execution
    }
}