import { errorMonitor } from "events";
import mongoose from "mongoose";



const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      socketTimeoutMS: 30000,
    })
    console.log(`MongDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("error", errorMonitor);
    process.exit(1);
  }
};

export default connectDB;
