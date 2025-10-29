import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who performed the action
    action: { type: String, required: true }, // e.g., "user:suspend"
    targetId: { type: mongoose.Schema.Types.ObjectId, refPath: "targetType" }, // which document was affected
    targetType: { type: String }, // e.g., "User" or "Verification"
    reason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("AdminLog", adminLogSchema);
