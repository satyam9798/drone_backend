import * as datastoreService from '../datastore/datastoreService.js';

/**
 * Fetches product data from the datastore.
 * @returns {Promise<Array>} - Array of product objects.
 */
export const fetchProducts = async () => {
    return await datastoreService.getProducts();
};
