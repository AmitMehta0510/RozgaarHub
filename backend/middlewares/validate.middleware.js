// backend/middlewares/validate.middleware.js
import { validationResult } from "express-validator";
import { logger } from "../utils/logger.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.warn(`[VALIDATION ERROR] ${JSON.stringify(errors.array())}`);
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  logger.info(`[VALIDATION SUCCESS] ${req.method} ${req.originalUrl}`);
  next();
};