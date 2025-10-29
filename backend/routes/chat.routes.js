// backend/routes/chat.routes.js
import express from "express";
import {
  getChats,
  createChat,
  getMessages,
} from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { body, param, query } from "express-validator";

const router = express.Router();

/**
 * @route   GET /api/chats
 * @desc    Get current user's chats (paginated)
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be >= 1"),
    query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be >= 1"),
  ],
  validate,
  getChats
);

/**
 * @route   POST /api/chats
 * @desc    Create or get chat between participants
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  [
    body("participants")
      .isArray({ min: 1 })
      .withMessage("Participants must be a non-empty array"),
  ],
  validate,
  createChat
);

/**
 * @route   GET /api/chats/:chatId/messages
 * @desc    Get messages of a specific chat
 * @access  Private
 */
router.get(
  "/:chatId/messages",
  authMiddleware,
  [param("chatId").isMongoId().withMessage("Invalid chat ID")],
  validate,
  getMessages
);

export default router;
