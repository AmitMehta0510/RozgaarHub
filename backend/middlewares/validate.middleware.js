// backend/middlewares/validate.js
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            code: 400,
            message: error.details[0].message,
          },
        });
      }
      next();
    } catch (err) {
      console.error("Validation middleware error:", err);
      res.status(500).json({
        success: false,
        error: {
          code: 500,
          message: "Internal server error during validation",
        },
      });
    }
  };
};
