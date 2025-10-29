import crypto from "crypto";
import twilio from "twilio"; // Optional – only if you plan to send real OTPs via SMS
import dotenv from "dotenv";

dotenv.config();

/**
 * ✅ Hash OTP securely using SHA256
 */
export const hashOtp = async (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

/**
 * ✅ Verify provided OTP against stored hash
 */
export const verifyOtpHash = async (enteredOtp, storedHash) => {
  const enteredHash = crypto.createHash("sha256").update(enteredOtp).digest("hex");
  return enteredHash === storedHash;
};

/**
 * ✅ Send OTP via a provider (Twilio / mock fallback)
 * In dev mode, this just logs to console.
 */
export const sendOtpViaProvider = async (phone, otp) => {
  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your RozgaarHub OTP is ${otp}. It will expire in 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      console.log(`✅ OTP sent to ${phone}`);
    } else {
      console.log(`📱 Mock OTP for ${phone}: ${otp}`);
    }
  } catch (err) {
    console.error("❌ Error sending OTP:", err.message);
    throw new Error("Failed to send OTP");
  }
};
