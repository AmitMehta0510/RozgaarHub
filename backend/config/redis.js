import { createClient } from "redis";
import { logger } from "../utils/logger.js";
import { ENV } from "./env.js";

export const redisClient = createClient({
  url: ENV.REDIS_URL,
});

redisClient.on("connect", () => logger.info("✅ Redis connected successfully"));
redisClient.on("ready", () => logger.info("Redis client is ready"));
redisClient.on("error", (err) => logger.error("❌ Redis Client Error:", err));
redisClient.on("end", () => logger.warn("⚠️ Redis connection closed"));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error("❌ Redis connection failed:", err.message);
    setTimeout(connectRedis, 5000); // Retry
  }
};
