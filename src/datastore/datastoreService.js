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
        const result = await query('SELECT * FROM public.products', []);
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
        const result = await query('SELECT * FROM public.products WHERE id = $1', [productId]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    } catch (error) {
        throw new DatastoreError(`Error fetching public.product with ID: ${productId}`);
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
            shortDescription,
            longDescription,
            categoryId,
            displayImageId,
            imageIds,
            price,
            inStock,
            isFeatured,
            features,
        } = productData;
        const result = await query(
            `INSERT INTO public.products (name, short_description, long_description, category_id, display_image_id, image_ids, price, discounted_price, in_stock, is_featured, features)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [
                name,
                shortDescription,
                longDescription,
                categoryId,
                displayImageId,
                imageIds,
                price,
                price,
                inStock,
                isFeatured,
                features,
            ],
        );
        return result.rows[0];
    } catch (error) {
        throw new DatastoreError('Error inserting product into database');
    }
};

export const updateProductIntoDB = async (id, productData) => {
    try {
        const {
            name,
            shortDescription,
            longDescription,
            categoryId,
            displayImageId,
            imageIds,
            price,
            inStock,
            isFeatured,
            features,
        } = productData;

        const result = await query(
            `UPDATE public.products
            SET name = $1,
                short_description = $2,
                long_description = $3,
                category_id = $4,
                display_image_id = $5,
                image_ids = $6,
                price = $7,
                discounted_price = $8,
                in_stock = $9,
                is_featured = $10,
                features=$11
            WHERE id = $12
            RETURNING *`,
            [
                name,
                shortDescription,
                longDescription,
                categoryId,
                displayImageId,
                imageIds,
                price,
                price,
                inStock,
                isFeatured,
                features,
                id,
            ],
        );

        return result.rows[0];
    } catch (error) {
        throw new DatastoreError('Error updating product in the database');
    }
};

export const insertImage = async (filename, data, mimetype) => {
    const result = await query(
        'INSERT INTO public.images (filename, data, mimetype) VALUES ($1, $2, $3) RETURNING id',
        [filename, data, mimetype],
    );
    return result.rows[0];
};

export const getImage = async (id) => {
    const result = await query('SELECT * FROM public.images WHERE id = $1', [id]);
    return result.rows[0];
};

export const getAllImage = async () => {
    try {
        const images = await query(
            `
        SELECT 
        i.id AS image_id,
        i.filename,
        p.id AS product_id,
        p.name AS product_name
      FROM public.images i
      LEFT JOIN public.products p
        ON i.id = p.display_image_id OR i.id = ANY(p.image_ids);
      
    `,
            [],
        );

        return images;
    } catch (error) {
        console.log({ error });
    }
};

export const checkImageLinking = async (imageId) => {
    const isLinked = await query(
        `
      SELECT 1 FROM public.products
      WHERE display_image_id = $1 OR $1 = ANY(image_ids)
      LIMIT 1;
    `,
        [imageId],
    );

    return isLinked;
};

export const deleteImageById = async (imageId) => {
    try {
        const data = await query('DELETE FROM public.images WHERE id = $1', [imageId]);
    } catch (error) {
        console.log(error);
    }
};

export const deleteProductById = async (productId) => {
    try {
        const data = await query('DELETE FROM public.products WHERE id = $1', [productId]);
    } catch (error) {
        console.log(error);
    }
};
