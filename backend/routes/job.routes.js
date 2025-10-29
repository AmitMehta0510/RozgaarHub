import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { body, param } from "express-validator";

const router = express.Router();

/**
 * @route   POST /api/jobs
 * @desc    Create new job
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  [
    body("title").notEmpty().withMessage("Job title is required"),
    body("description").notEmpty().withMessage("Job description is required"),
    body("location").optional().isString(),
    body("salary").optional().isNumeric(),
  ],
  validate,
  createJob
);

/**
 * @route   GET /api/jobs
 * @desc    Get all jobs
 * @access  Public
 */
router.get("/", getJobs);

/**
 * @route   GET /api/jobs/:id
 * @desc    Get job by ID
 * @access  Public
 */
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid job ID")],
  validate,
  getJobById
);

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update job
 * @access  Private
 */
router.put(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid job ID")],
  validate,
  updateJob
);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete job
 * @access  Private
 */
router.delete(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid job ID")],
  validate,
  deleteJob
);

export default router;
