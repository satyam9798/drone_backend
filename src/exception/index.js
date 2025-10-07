import { AppError } from './exception.js';

/**
 * Custom error for database-related issues.
 * @extends AppError
 */
export class DatastoreError extends AppError {
    constructor(message = 'Datastore error') {
        super(500, message);
    }
}

/**
 * Custom error for bad request errors.
 * @extends AppError
 */
export class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(400, message);
    }
}
