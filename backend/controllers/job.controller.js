// controllers/job.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import Job from "../models/job.model.js";

export const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({ ...req.body, employer: req.user.id }); // ✅ changed
  res.status(201).json({ success: true, data: job });
});

export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate("employer", "name email"); // ✅ changed
  res.json({ success: true, data: jobs });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate("employer", "name email"); // ✅ changed
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });
  res.json({ success: true, data: job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, message: "Job updated", data: job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Job deleted" });
});
