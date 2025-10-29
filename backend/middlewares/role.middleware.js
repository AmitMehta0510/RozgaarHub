export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ success: false, error: { code: 401, message: "Unauthorized" } });

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: { code: 403, message: "Forbidden: Insufficient role" } });
    }

    next();
  };
};
