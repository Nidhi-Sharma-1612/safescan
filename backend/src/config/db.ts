import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "safescan",
    });

    console.log(
      `✅ MongoDB Connected to DB: ${conn.connection.name} at ${conn.connection.host}`
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
