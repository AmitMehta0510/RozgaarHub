import express from "express";
import { body, param } from "express-validator";
import {
  getCatalogItems,
  addCatalogItem,
  deleteCatalogItem,
} from "../controllers/catalog.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/catalog
 * @desc    Fetch all catalog items
 * @access  Public
 */
router.get("/", getCatalogItems);

/**
 * @route   POST /api/catalog
 * @desc    Add a new catalog item
 * @access  Admin
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional().isString(),
    body("price").isNumeric().withMessage("Price must be a number"),
  ],
  addCatalogItem
);

/**
 * @route   DELETE /api/catalog/:id
 * @desc    Delete a catalog item by ID
 * @access  Admin
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  [param("id").isMongoId().withMessage("Invalid catalog item ID")],
  deleteCatalogItem
);

export default router;
