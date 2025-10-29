import jwt from "jsonwebtoken";
import crypto from "crypto";
import dayjs from "dayjs";
import dotenv from "dotenv";

dotenv.config();

/**
 * ✅ Generate JWT Access Token
 * Used for short-term authentication (usually 15–30 mins)
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

/**
 * ✅ Generate Refresh Token
 * Long-lived token stored in DB to issue new access tokens
 */
export const generateRefreshToken = () => {
  const raw = crypto.randomBytes(40).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const expiresAt = dayjs().add(7, "day").toDate(); // 7-day expiry

  return { raw, hash, expiresAt };
};

/**
 * ✅ Verify and decode JWT
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
