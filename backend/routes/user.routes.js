import express from "express";
import {
  getProfile,
  updateProfile,
  getAllUsers,
} from "../controllers/user.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";
import { body } from "express-validator";

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get logged-in user's profile
 * @access  Private
 */
router.get("/me", authMiddleware, getProfile);

/**
 * @route   PUT /api/users/me
 * @desc    Update profile of logged-in user
 * @access  Private
 */
router.put(
  "/me",
  authMiddleware,
  [
    body("name").optional().isString().withMessage("Name must be a string"),
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("bio").optional().isString(),
    body("location").optional().isString(),
  ],
  validate,
  updateProfile
);

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Admin
 */
router.get("/", authMiddleware, requireRole("admin"), getAllUsers);

export default router;
