import User from "../models/user.model.js";
import Job from "../models/job.model.js";
import Verification from "../models/verification.model.js";
import AuditLog from "../models/adminLog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, q, role, verified } = req.query;
  const filter = {};
  if (q) filter.$or = [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }];
  if (role) filter.role = role;
  if (verified !== undefined) filter.verified = verified === "true";

  const users = await User.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  const total = await User.countDocuments(filter);

  res.json({ success: true, data: users, meta: { page: Number(page), limit: Number(limit), total } });
});

export const setUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action, reason } = req.body;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, error: { message: "User not found" } });

  if (action === "suspend") user.isActive = false;
  else if (action === "unsuspend") user.isActive = true;
  else if (action === "ban") { user.isActive = false; user.banned = true; }

  await user.save();
  await AuditLog.create({ actor: req.user.id, action: `user:${action}`, targetId: id, reason });
  res.json({ success: true, data: user });
});

export const reviewVerification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const v = await Verification.findById(id);
  if (!v) return res.status(404).json({ success: false, error: { message: "Not found" } });

  v.status = status;
  v.reviewedBy = req.user.id;
  v.reviewedAt = new Date();
  v.notes = notes;
  await v.save();

  if (status === "approved") await User.findByIdAndUpdate(v.user, { $set: { verified: true } });
  await AuditLog.create({ actor: req.user.id, action: `verification:${status}`, targetId: v._id, reason: notes });

  res.json({ success: true, data: v });
});

export const stats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const jobsCount = await Job.countDocuments();
  const openJobs = await Job.countDocuments({ isActive: true });
  const verificationsPending = await Verification.countDocuments({ status: "pending" });

  res.json({ success: true, data: { usersCount, jobsCount, openJobs, verificationsPending } });
});
