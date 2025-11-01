import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URI as string;

let isConnected = false;

export const dbConnect = async () => {
  if (isConnected) {
    console.log(" MongoDB already connected");
    return;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      dbName: "kanban-job-tracker",
    });

    isConnected = !!connection.connections[0].readyState;
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    throw new Error("Database connection failed");
  }
};
