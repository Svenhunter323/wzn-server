import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function setupMongo() {
  const uri = process.env.DB_URL || "mongodb://localhost:27017/weizen";
  console.log(uri);
  try {
    await mongoose.connect(uri);
    console.log("[MongoDB] Connected:", uri);
  } catch (error) {
    console.error("[MongoDB] Connection failed:", error);
    process.exit(1);
  }
}
