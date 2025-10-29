import express from "express";
import { postMessage, markRead } from "../controllers/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { body, param } from "express-validator";

const router = express.Router();

/**
 * @route   POST /api/messages/:chatId
 * @desc    Post a message in a chat
 * @access  Private
 */
router.post(
  "/:chatId",
  authMiddleware,
  [
    param("chatId").isMongoId().withMessage("Invalid chat ID"),
    body("content").notEmpty().withMessage("Message content is required"),
  ],
  validate,
  postMessage
);

/**
 * @route   PATCH /api/messages/:chatId/read
 * @desc    Mark messages as read
 * @access  Private
 */
router.patch(
  "/:chatId/read",
  authMiddleware,
  [
    param("chatId").isMongoId().withMessage("Invalid chat ID"),
    body("messageIds")
      .isArray({ min: 1 })
      .withMessage("messageIds array is required"),
  ],
  validate,
  markRead
);

export default router;
