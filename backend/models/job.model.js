import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: [
        "Household",
        "Maintenance",
        "Hospitality",
        "Technical",
        "Education",
        "Healthcare",
      ],
      required: true,
    },
    jobType: { type: String, enum: ["daily", "contract", "fulltime"], default: "daily" },
    salary: { type: Number },
    salaryType: { type: String, enum: ["hourly", "daily", "monthly"], default: "daily" },
    location: {
      city: String,
      state: String,
      pincode: String,
    },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
