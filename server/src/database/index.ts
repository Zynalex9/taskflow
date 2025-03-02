import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv()
export async function connectDB(){
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI!);
        console.log(`MongoDB connected: ${connection.connection.name}`);
    } catch (error) {
        console.log(error);
        process.exit(1);

    }
}