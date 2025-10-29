import Notification from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, notifications });
});

export const markAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ success: true, message: "Notifications marked as read" });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findByIdAndDelete(id);
  if (!notification)
    return res.status(404).json({ success: false, message: "Notification not found" });
  res.json({ success: true, message: "Notification deleted" });
});
