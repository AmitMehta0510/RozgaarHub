import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // Redis
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // JWT / Auth
  JWT_SECRET: process.env.JWT_SECRET || "supersecret",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  // Payment
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,

  // Other APIs
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
