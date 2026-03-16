import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {

  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {

    const db = await mongoose.connect(process.env.MONGO_URI as string);

    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log("MongoDB connected successfully");
    }

  } catch (error) {

    console.error("MongoDB connection error:", error);
    process.exit(1);

  }
}