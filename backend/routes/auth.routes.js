import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  logout,
  requestOtp,
  verifyOtp,
  refresh,
  getProfile,
  updatePassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ---------- OTP AUTH ----------
router.post("/request-otp", [body("phone").notEmpty()], requestOtp);
router.post("/verify-otp", [body("phone").notEmpty(), body("code").notEmpty()], verifyOtp);

// ---------- EMAIL AUTH ----------
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("phone").notEmpty(),
  ],
  register
);

router.post("/login", [body("email").isEmail(), body("password").notEmpty()], login);
router.post("/refresh", [body("refreshToken").notEmpty()], refresh);
router.post("/logout", authMiddleware, logout);

// ---------- PROFILE ----------
router.get("/profile", authMiddleware, getProfile);
router.put(
  "/update-password",
  authMiddleware,
  [body("oldPassword").notEmpty(), body("newPassword").isLength({ min: 6 })],
  updatePassword
);

export default router;
