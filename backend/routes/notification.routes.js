import express from "express";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";
import { param } from "express-validator";

const router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for current user
 * @access  Private
 */
router.get("/", authMiddleware, getNotifications);

/**
 * @route   PATCH /api/notifications/read
 * @desc    Mark all unread notifications as read
 * @access  Private
 */
router.patch("/read", authMiddleware, markAsRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a specific notification
 * @access  Private
 */
router.delete(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid notification ID")],
  validate,
  deleteNotification
);

export default router;
