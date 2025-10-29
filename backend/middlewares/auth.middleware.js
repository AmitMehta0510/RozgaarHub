import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Middleware: Authenticate requests using JWT access token
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: "Access denied. No token provided." },
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 404, message: "User not found." },
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({
      success: false,
      error: { code: 401, message: "Invalid or expired token." },
    });
  }
};

/**
 * Middleware: Restrict access to specific roles (e.g., ['admin'])
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 403, message: "Access denied. Insufficient privileges." },
      });
    }
    next();
  };
};

/**
 * Middleware: Verify refresh token from cookies for token renewal
 */
export const verifyRefreshToken = (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: "No refresh token provided." },
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Refresh token error:", err.message);
    return res.status(401).json({
      success: false,
      error: { code: 401, message: "Invalid or expired refresh token." },
    });
  }
};
