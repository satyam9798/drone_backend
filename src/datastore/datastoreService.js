import { query } from './dbClient.js';
import { DatastoreError } from '../exception/index.js';
import logger from '../utils/logger.js';

/**
 * Fetch all products from the database.
 * @returns {Promise<Array>} List of products.
 * @throws {DatastoreError} When a database error occurs.
 */
export const fetchProductsFromDB = async () => {
    try {
        const result = await query('SELECT * FROM products', []);
        return result.rows;
    } catch (error) {
        throw new DatastoreError('Error fetching products from database');
    }
};
/**
 * Fetch a single product by ID.
 * @param {number} productId - The product ID.
 * @returns {Promise<Object>} Product details.
 * @throws {DatastoreError} When a database error occurs.
 */
export const fetchProductByIdFromDB = async (productId) => {
    try {
        const result = await query('SELECT * FROM products WHERE id = $1', [productId]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    } catch (error) {
        throw new DatastoreError(`Error fetching product with ID: ${productId}`);
    }
};

/**
 * Insert a new product into the database.
 * @param {Object} productData - The product details.
 * @returns {Promise<Object>} Inserted product details.
 * @throws {DatastoreError} When a database error occurs.
 */
export const insertProductIntoDB = async (productData) => {
    try {
        const {
            name,
            description,
            category_id,
            original_price,
            discounted_price,
            stock_quantity,
            is_featured,
        } = productData;
        const result = await query(
            `INSERT INTO products (name, description, category_id, original_price, discounted_price, stock_quantity, is_featured)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                name,
                description,
                category_id,
                original_price,
                discounted_price,
                stock_quantity,
                is_featured,
            ],
        );
        return result.rows[0];
    } catch (error) {
        throw new DatastoreError('Error inserting product into database');
    }
};
