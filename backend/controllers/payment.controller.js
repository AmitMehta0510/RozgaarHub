import Payment from "../models/payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPayment = asyncHandler(async (req, res) => {
  const { amount, method, jobId } = req.body;
  const payment = await Payment.create({
    user: req.user._id,
    amount,
    method,
    job: jobId,
    status: "completed",
  });
  res.status(201).json({ success: true, payment });
});

export const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, payments });
});
