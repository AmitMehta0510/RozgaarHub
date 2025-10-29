import express from "express";
import {
  createPayment,
  getPayments,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";
import { body } from "express-validator";

const router = express.Router();

/**
 * @route   POST /api/payments
 * @desc    Create a payment record (mock or real gateway integration)
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  [
    body("amount").isNumeric().withMessage("Amount must be a valid number"),
    body("method").notEmpty().withMessage("Payment method is required"),
    body("jobId").optional().isMongoId().withMessage("Invalid jobId"),
  ],
  validate,
  createPayment
);

/**
 * @route   GET /api/payments
 * @desc    Get all payments of the current user
 * @access  Private
 */
router.get("/", authMiddleware, getPayments);

export default router;
