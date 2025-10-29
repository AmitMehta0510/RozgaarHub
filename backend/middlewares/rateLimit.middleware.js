import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: {
    success: false,
    error: { code: 429, message: "Too many requests, please try again later" },
  },
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5,
  message: {
    success: false,
    error: { code: 429, message: "Too many login/signup attempts, slow down" },
  },
});

export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 3,
  message: {
    success: false,
    error: { code: 429, message: "OTP request limit exceeded, try later" },
  },
});
