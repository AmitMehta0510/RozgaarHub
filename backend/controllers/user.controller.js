import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { logger } from "../utils/logger.js";

// 🧩 Get Own Profile
export const getProfile = asyncHandler(async (req, res) => {
  logger.info(`[GET PROFILE] Route hit by user ${req.user?.id}`);

  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    logger.warn(`[GET PROFILE] User not found: ${req.user?.id}`);
    return res.status(404).json({ success: false, message: "User not found" });
  }

  logger.info(`[GET PROFILE] Success for user ${req.user.id}`);
  res.json({ success: true, data: user });
});

// 🧩 Update Own Profile
export const updateProfile = asyncHandler(async (req, res) => {
  logger.info(`[UPDATE PROFILE] Route hit by user ${req.user?.id}`);
  logger.info(`[UPDATE PROFILE] Incoming body: ${JSON.stringify(req.body)}`);

  const updates = { ...req.body };

  // ⚠️ Prevent updating restricted fields
  delete updates._id;
  delete updates.email;
  delete updates.password;
  delete updates.role;

  logger.info(`[UPDATE PROFILE] Filtered updates: ${JSON.stringify(updates)}`);

  // ✅ Ensure location object is valid if included
  if (updates.location) {
    if (typeof updates.location !== "object") {
      logger.warn(`[UPDATE PROFILE] Invalid location type`);
      return res.status(400).json({
        success: false,
        message: "Location must be an object with lat/lng",
      });
    }
    if (!("lat" in updates.location) || !("lng" in updates.location)) {
      logger.warn(`[UPDATE PROFILE] Invalid location object`);
      return res.status(400).json({
        success: false,
        message: "Invalid location object. Must include lat and lng.",
      });
    }
  }

  logger.info(`[UPDATE PROFILE] Calling findByIdAndUpdate for user ${req.user.id}`);

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  logger.info(`[UPDATE PROFILE] findByIdAndUpdate finished`);

  if (!updatedUser) {
    logger.warn(`[UPDATE PROFILE] No user found for id ${req.user.id}`);
    return res.status(404).json({ success: false, message: "User not found" });
  }

  logger.info(`[UPDATE PROFILE] Success for user ${req.user.id}`);
  res.json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

// 🧩 Get All Users (Admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  logger.info(`[GET ALL USERS] Called by user ${req.user?.id}`);
  const users = await User.find().select("-password");
  logger.info(`[GET ALL USERS] Returned ${users.length} users`);
  res.json({ success: true, data: users });
});
