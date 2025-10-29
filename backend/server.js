import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import "dotenv/config";

import { errorHandler } from "./middlewares/error.middleware.js";
import { logger, stream } from "./utils/logger.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";

// ---------- ROUTE IMPORTS ----------
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import catalogRoutes from "./routes/catalog.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import moderationRoutes from "./routes/moderation.routes.js";

// ---------- EXPRESS APP ----------
const app = express();
const PORT = ENV.PORT;

// ---------- MIDDLEWARE ----------
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined", { stream }));

// ---------- RATE LIMIT ----------
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/moderation", moderationRoutes);

// ---------- HEALTH CHECK ----------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RozgaarHub Backend is running 🚀",
  });
});

// ---------- ERROR HANDLER ----------
app.use(errorHandler);

// ---------- SERVER START ----------
const server = app.listen(PORT, async () => {
  await connectDB();
  await connectRedis();
  logger.info(`✅ Server running in ${ENV.NODE_ENV} mode on port ${PORT}`);
});

// ---------- GRACEFUL SHUTDOWN ----------
process.on("unhandledRejection", (err) => {
  logger.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  logger.info("🛑 SIGTERM received. Closing gracefully...");
  server.close(() => {
    logger.info("Process terminated.");
  });
});
