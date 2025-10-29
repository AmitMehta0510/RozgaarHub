import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Post a message (fallback REST)
 */
export const postMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      error: { message: "Message required" },
    });
  }

  const chat = await Chat.findById(chatId);
  if (!chat || !chat.participants.includes(req.user.id)) {
    return res.status(403).json({
      success: false,
      error: { message: "Not allowed" },
    });
  }

  const message = await Message.create({
    chat: chatId,
    sender: req.user.id,
    content,
  });

  chat.lastMessage = content;
  chat.lastMessageAt = new Date();
  await chat.save();

  // emit to participants via socket
  const io = req.app.get("io");
  if (io) {
    chat.participants.forEach((pid) => {
      io.to(`user:${pid}`).emit("message:received", { chatId, message });
    });
  }

  res.status(201).json({ success: true, data: message });
});

/**
 * Mark messages as read
 */
export const markRead = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { messageIds } = req.body; // array

  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: { message: "messageIds required" },
    });
  }

  await Message.updateMany(
    { _id: { $in: messageIds } },
    { $addToSet: { seenBy: req.user.id } }
  );

  // emit read receipt
  const io = req.app.get("io");
  if (io) io.emit("message:read", { chatId, messageIds, by: req.user.id });

  res.json({ success: true });
});
