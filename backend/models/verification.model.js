import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documents: [
      {
        type: {
          type: String, // e.g. "aadhar", "pan", "license"
          required: true,
        },
        url: {
          type: String, // Cloudinary or S3 URL
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin who reviewed
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Verification", verificationSchema);
