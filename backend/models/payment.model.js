import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String, // e.g. "UPI", "Card", "Wallet", "Cash"
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String, // optional ID from payment gateway
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
