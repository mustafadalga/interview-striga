import mongoose from "mongoose";
import { env } from "@/_constants";

export async function connectDB() {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(env.MONGODB_URL);
            console.log("MongoDB connected");
        }
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error; // Propagate error to stop execution
    }
}