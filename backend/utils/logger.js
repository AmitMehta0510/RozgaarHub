import winston from "winston";
import fs from "fs";
import path from "path";

// Ensure logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFormat = winston.format.printf(({ timestamp, level, message, stack }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({ handleExceptions: true }),
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(logDir, "combined.log") }),
  ],
  exitOnError: false,
});

// Stream for morgan logging
const stream = {
  write: (message) => logger.info(message.trim()),
};

export { logger, stream };
