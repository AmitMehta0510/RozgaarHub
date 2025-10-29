import express from "express";
import { body, param, query } from "express-validator";
import {
  listUsers,
  setUserStatus,
  reviewVerification,
  stats,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

// Middleware: only authenticated admins can access these routes
const adminOnly = [authMiddleware, roleMiddleware(["admin"])];

/**
 * @route   GET /api/admin/users
 * @desc    List users with filters and pagination
 * @access  Admin
 */
router.get(
  "/users",
  adminOnly,
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1 }).toInt(),
    query("q").optional().isString(),
    query("role").optional().isString(),
    query("verified").optional().isBoolean().toBoolean(),
  ],
  listUsers
);

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Update user status (suspend, unsuspend, ban)
 * @access  Admin
 */
router.patch(
  "/users/:id/status",
  adminOnly,
  [
    param("id").isMongoId().withMessage("Invalid user ID"),
    body("action")
      .isIn(["suspend", "unsuspend", "ban"])
      .withMessage("Action must be one of suspend, unsuspend, or ban"),
    body("reason").optional().isString(),
  ],
  setUserStatus
);

/**
 * @route   PATCH /api/admin/verifications/:id/review
 * @desc    Review a verification request
 * @access  Admin
 */
router.patch(
  "/verifications/:id/review",
  adminOnly,
  [
    param("id").isMongoId().withMessage("Invalid verification ID"),
    body("status")
      .isIn(["approved", "rejected", "pending"])
      .withMessage("Status must be approved, rejected, or pending"),
    body("notes").optional().isString(),
  ],
  reviewVerification
);

/**
 * @route   GET /api/admin/stats
 * @desc    Get overall admin dashboard stats
 * @access  Admin
 */
router.get("/stats", adminOnly, stats);

export default router;
