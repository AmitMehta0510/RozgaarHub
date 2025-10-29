/**
 * @description Wraps async route handlers and passes errors to next()
 * @param {Function} fn - The async route/controller function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
