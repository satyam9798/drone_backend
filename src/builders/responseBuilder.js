
/**
 * Creates a standardized success response.
 * @param {any} data - The data to return.
 * @returns {Object} - Success response object.
 */
export const createSuccessResponse = (data) => ({
    success: true,
    data,
});



/**
 * Creates a standardized error response.
 * @param {number} status - HTTP status code.
 * @param {string} message - Error message.
 * @returns {Object} - Error response object.
 */
export const createErrorResponse = (status, message) => ({
    success: false,
    status,
    message,
});
