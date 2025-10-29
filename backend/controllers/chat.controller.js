import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Get current user's chats (paginated)
 */
export const getChats = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const chats = await Chat.find({ participants: req.user.id })
    .sort({ lastMessageAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("participants", "name profileImage");

  res.json({ success: true, data: chats });
});

/**
 * Create / get chat between participants
 */
export const createChat = asyncHandler(async (req, res) => {
  const { participants } = req.body; // array of userIds

  if (!participants || !Array.isArray(participants)) {
    return res.status(400).json({
      success: false,
      error: { message: "Participants required" },
    });
  }

  // ensure requester is a participant
  if (!participants.includes(String(req.user.id))) {
    participants.push(String(req.user.id));
  }

  // find existing chat with exact participants (simple approach)
  const existing = await Chat.findOne({
    participants: { $size: participants.length, $all: participants },
  });

  if (existing) {
    return res.json({ success: true, data: existing });
  }

  const chat = await Chat.create({ participants });
  res.status(201).json({ success: true, data: chat });
});

/**
 * Get messages for a chat
 */
export const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { limit = 50, before } = req.query;

  // Ensure user is participant
  const chat = await Chat.findById(chatId);
  if (!chat || !chat.participants.includes(req.user.id)) {
    return res.status(403).json({
      success: false,
      error: { message: "Not allowed" },
    });
  }

  const filter = { chat: chatId };
  if (before) filter._id = { $lt: before };

  const messages = await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate("sender", "name profileImage");

  res.json({ success: true, data: messages.reverse() }); // reverse to chronological order
});
