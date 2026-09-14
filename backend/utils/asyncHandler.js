/**
 * Wraps an async Express route handler so any rejected promise / thrown
 * error is forwarded to next(), where the central errorHandler middleware
 * will format the response. Avoids repeating try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
