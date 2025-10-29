import express from "express";
import {
  moderateJob,
  moderateReview,
} from "../controllers/moderation.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { body } from "express-validator";

const router = express.Router();

/**
 * @route   POST /api/moderation/job
 * @desc    Approve or reject a job post
 * @access  Admin / Moderator
 */
router.post(
  "/job",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  [
    body("jobId").isMongoId().withMessage("Valid jobId is required"),
    body("action")
      .isIn(["approve", "reject"])
      .withMessage("Action must be 'approve' or 'reject'"),
  ],
  validate,
  moderateJob
);

/**
 * @route   POST /api/moderation/review
 * @desc    Moderate (delete) user reviews
 * @access  Admin / Moderator
 */
router.post(
  "/review",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  [
    body("reviewId").isMongoId().withMessage("Valid reviewId is required"),
    body("action")
      .isIn(["delete"])
      .withMessage("Action must be 'delete'"),
  ],
  validate,
  moderateReview
);

export default router;
