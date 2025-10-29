import express from "express";
import multer from "multer";
import { uploadFile, deleteFile } from "../controllers/media.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { body } from "express-validator";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

/**
 * @route   POST /api/media/upload
 * @desc    Upload file to Cloudinary
 * @access  Private
 */
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

/**
 * @route   DELETE /api/media
 * @desc    Delete file from Cloudinary
 * @access  Private
 */
router.delete(
  "/",
  authMiddleware,
  [body("publicId").notEmpty().withMessage("publicId is required")],
  validate,
  deleteFile
);

export default router;
