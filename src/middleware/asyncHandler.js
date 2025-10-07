/**
 * Middleware to handle async errors in controllers.
 * @param {Function} fn - The async function to be wrapped.
 * @returns {Function} - A function wrapped with error handling.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
