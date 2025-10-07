/**
 * Base class for application errors.
 * @extends Error
 */
export class AppError extends Error {
    /**
     * @param {number} status - HTTP status code.
     * @param {string} message - Error message.
     */
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
