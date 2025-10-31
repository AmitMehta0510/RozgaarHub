import express from "express";
import { body, param, query } from "express-validator";
import {
  applyToJob,
  myApplications,
  updateApplicationStatus,
  withdrawApplication,
} from "../controllers/application.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/applications/:jobId
 * @desc    Apply to a specific job
 * @access  Worker (authenticated)
 */
router.post(
  "/:jobId",
  authMiddleware,
  [
    param("jobId").isMongoId().withMessage("Invalid Job ID"),
    body("coverLetter").optional().isString(),
    body("resume").optional().isString(),
  ],
  applyToJob
);

/**
 * @route   GET /api/applications/my
 * @desc    Get logged-in user's applications (paginated)
 * @access  Worker (authenticated)
 */
router.get(
  "/my",
  authMiddleware,
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1 }).toInt(),
  ],
  myApplications
);

/**
 * @route   PATCH /api/applications/:id/status
 * @desc    Update status of an application (for employers/admin)
 * @access  Employer/Admin
 */
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole(["recruiter", "admin"]),
  [
    param("id").isMongoId().withMessage("Invalid Application ID"),
    body("status")
      .isIn(["pending", "reviewed", "interview", "rejected", "hired", "withdrawn"])
      .withMessage("Invalid status value"),
    body("note").optional().isString(),
  ],
  updateApplicationStatus
);

/**
 * @route   DELETE /api/applications/:id
 * @desc    Withdraw an existing application
 * @access  Worker (authenticated)
 */
router.delete(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid Application ID")],
  withdrawApplication
);

export default router;
