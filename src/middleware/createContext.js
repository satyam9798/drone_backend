import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';

const als = new AsyncLocalStorage();

/**
 * Middleware to create a request context and store a unique transaction ID
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createContext = (req, res, next) => {
    const transactionId = uuidv4();

    als.run(new Map(), () => {
        als.getStore().set('transactionId', transactionId);
        next();
    });
};

/**
 * Get the current transaction ID from AsyncLocalStorage
 * @returns {string} transactionId
 */
const getTransactionId = () => {
    return als.getStore()?.get('transactionId') || 'N/A';
};

export { createContext, getTransactionId };
