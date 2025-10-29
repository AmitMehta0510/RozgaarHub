import { v2 as cloudinary } from "cloudinary";
import { logger } from "../utils/logger.js";
import { ENV } from "./env.js";

if (!ENV.CLOUDINARY_CLOUD_NAME || !ENV.CLOUDINARY_API_KEY || !ENV.CLOUDINARY_API_SECRET) {
  logger.warn("⚠️ Missing Cloudinary ENV variables. File uploads may fail.");
}

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
