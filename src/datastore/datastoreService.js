import { query } from './dbClient.js';
import { DatastoreError } from '../exception/index.js';
import logger from '../utils/logger.js';

/**
 * Fetches all products from the database.
 * @returns {Promise<Array>} - Array of product objects.
 * @throws {DatastoreError} - If there is a database error.
 */
export const getProducts = async () => {
    try {
        logger.info('Fetching products from database...');

        const result = await query('SELECT * FROM products');
        return result.rows;
    } catch (error) {
        logger.error(`Error fetching products: ${error.message}`);

        throw new DatastoreError('Error fetching products');
    }
};
