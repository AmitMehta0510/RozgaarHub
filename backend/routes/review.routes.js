import express from "express";
import {
  createReview,
  getJobReviews,
  deleteReview,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { body, param } from "express-validator";

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a new review for a job
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  [
    body("jobId").isMongoId().withMessage("Valid jobId is required"),
    body("rating")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage("Comment too long"),
  ],
  validate,
  createReview
);

/**
 * @route   GET /api/reviews/:jobId
 * @desc    Get all reviews for a job
 * @access  Public
 */
router.get(
  "/:jobId",
  [param("jobId").isMongoId().withMessage("Invalid jobId")],
  validate,
  getJobReviews
);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review (admin or reviewer only)
 * @access  Private
 */
router.delete(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid review ID")],
  validate,
  deleteReview
);

export default router;
