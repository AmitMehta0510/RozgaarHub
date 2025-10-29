import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  // Log detailed error info
  logger.error(`[${req.method}] ${req.originalUrl} — ${err.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    error: {
      code: status,
      message: err.message || "Internal Server Error",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
};
