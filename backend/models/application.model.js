import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "hired", "rejected"],
      default: "applied",
    },
    coverLetter: { type: String },
    resume: { type: String },
    feedback: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
