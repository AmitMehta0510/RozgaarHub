import Review from "../models/review.model.js";
import Job from "../models/job.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const { jobId, rating, comment } = req.body;
  const reviewer = req.user._id;

  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });

  const review = await Review.create({ reviewer, job: jobId, rating, comment });
  res.status(201).json({ success: true, review });
});

export const getJobReviews = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const reviews = await Review.find({ job: jobId }).populate("reviewer", "name email");
  res.json({ success: true, reviews });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });
  res.json({ success: true, message: "Review deleted" });
});
