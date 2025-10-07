import { createErrorResponse } from '../builders/responseBuilder.js';

/**
 * Global error handler middleware.
 * @param {Error} err - Error object.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json(createErrorResponse(status, err.message || 'Server Error'));
};

export default errorHandler;
