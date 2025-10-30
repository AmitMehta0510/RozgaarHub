import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { logger } from "../utils/logger.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      logger.warn(`[AUTH] Missing token`);
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`[AUTH] Token verified for user ${decoded.id}`);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      logger.warn(`[AUTH] Invalid user for token`);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = user;
    logger.info(`[AUTH] Auth success for user ${user._id}`);
    next();
  } catch (err) {
    logger.error(`[AUTH ERROR] ${err.message}`);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized", error: err.message });
  }
};

// Optional: Role-based middleware
export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role)
    return res.status(403).json({ success: false, message: "Access denied" });
  next();
};
