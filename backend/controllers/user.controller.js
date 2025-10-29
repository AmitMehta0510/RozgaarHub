import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { logger } from "../utils/logger.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
  res.json({ success: true, message: "Profile updated", data: user });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, data: users });
});
