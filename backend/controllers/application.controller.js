import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

export const applyToJob = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { jobId } = req.params;
    const { coverLetter, resume } = req.body;
    const applicantId = req.user.id;

    const job = await Job.findById(jobId).session(session);
    if (!job || !job.isActive) {
      await session.abortTransaction(); session.endSession();
      return res.status(404).json({ success: false, error: { message: "Job not found or inactive" } });
    }

    const existing = await Application.findOne({ job: jobId, applicant: applicantId }).session(session);
    if (existing) {
      await session.abortTransaction(); session.endSession();
      return res.status(409).json({ success: false, error: { message: "Already applied" } });
    }

    const [application] = await Application.create(
      [{ job: job._id, applicant: applicantId, employer: job.employer, coverLetter, resume }],
      { session }
    );

    await Job.updateOne({ _id: job._id }, { $inc: { applicationsCount: 1 } }).session(session);

    await session.commitTransaction(); session.endSession();

    const io = req.app.get("io");
    if (io) io.to(`user:${String(job.employer)}`).emit("application:created", { jobId: job._id, applicant: applicantId });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    await session.abortTransaction(); session.endSession();
    throw err;
  }
});

export const myApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const list = await Application.find({ applicant: req.user.id })
    .populate("job")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Application.countDocuments({ applicant: req.user.id });
  res.json({ success: true, data: list, meta: { page: Number(page), limit: Number(limit), total } });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const app = await Application.findById(id).session(session);
    if (!app) {
      await session.abortTransaction(); session.endSession();
      return res.status(404).json({ success: false, error: { message: "Application not found" } });
    }

    const job = await Job.findById(app.job).session(session);
    if (String(job.employer) !== String(req.user.id) && req.user.role !== "admin") {
      await session.abortTransaction(); session.endSession();
      return res.status(403).json({ success: false, error: { message: "Not allowed" } });
    }

    app.status = status;
    if (note) {
      app.notes = app.notes || [];
      app.notes.push({ byUserId: req.user.id, text: note, createdAt: new Date() });
    }
    await app.save({ session });

    if (status === "hired") await Job.updateOne({ _id: job._id }, { $inc: { positions: -1 } }).session(session);

    await session.commitTransaction(); session.endSession();

    const io = req.app.get("io");
    if (io) io.to(`user:${String(app.applicant)}`).emit("application:status_changed", { applicationId: app._id, status });

    res.json({ success: true, data: app });
  } catch (err) {
    await session.abortTransaction(); session.endSession();
    throw err;
  }
});

export const withdrawApplication = asyncHandler(async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ success: false, error: { message: "Application not found" } });
  if (String(app.applicant) !== String(req.user.id))
    return res.status(403).json({ success: false, error: { message: "Not allowed" } });

  app.status = "withdrawn";
  await app.save();
  await Job.updateOne({ _id: app.job }, { $inc: { applicationsCount: -1 } });

  res.json({ success: true, data: app });
});
