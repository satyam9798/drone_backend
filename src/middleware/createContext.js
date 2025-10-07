const als = (await import('asynchronous-local-storage')).default;
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to create a request context and store a unique transaction ID
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createContext = (req, res, next) => {
    const transactionId = uuidv4();

    als.als.set('transactionId', transactionId);
    next();
};

/**
 * Retrieves the current transaction ID from AsyncLocalStorage
 * @returns {string} transactionId or 'UNKNOWN_TXN_ID' if not found
 */
const getTransactionId = async () => {
    return (await als.get('transactionId')) || 'UNKNOWN_TXN_ID';
};

export { createContext, getTransactionId };
