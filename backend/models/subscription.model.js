import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planName: { type: String, required: true }, // e.g. "Basic", "Pro"
    price: { type: Number, required: true },
    duration: { type: Number, default: 30 }, // days
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
