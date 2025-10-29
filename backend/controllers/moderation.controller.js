import Job from "../models/job.model.js";
import Review from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const moderateJob = asyncHandler(async (req, res) => {
  const { jobId, action } = req.body;
  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });

  job.status = action === "approve" ? "approved" : "rejected";
  await job.save();

  res.json({ success: true, message: `Job ${action}ed successfully` });
});

export const moderateReview = asyncHandler(async (req, res) => {
  const { reviewId, action } = req.body;
  const review = await Review.findById(reviewId);
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });

  if (action === "delete") await review.deleteOne();
  res.json({ success: true, message: `Review ${action}d successfully` });
});
