import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { ENV } from "./env.js";

export const connectDB = async () => {
  if (!ENV.MONGO_URI) {
    logger.error("❌ MONGO_URI not found in environment variables");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    setTimeout(connectDB, 5000); // Retry after 5s
  }
};
