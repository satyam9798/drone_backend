import * as productDatastore from '../datastore/datastoreService.js';

/**
 * Get all products.
 * @returns {Promise<Array>} List of products.
 * @throws {BadRequestError} If fetching fails.
 */
export const fetchProducts = async () => {
    const products = await productDatastore.fetchProductsFromDB();
    if (!products) {
        throw new BadRequestError('No products found');
    }
    return products;
};

/**
 * Get a product by ID.
 * @param {number} productId - The product ID.
 * @returns {Promise<Object>} Product details.
 * @throws {BadRequestError} If product is not found.
 */
export const fetchProductById = async (productId) => {
    const product = await productDatastore.fetchProductByIdFromDB(productId);
    if (!product) {
        throw new BadRequestError(`Product with ID ${productId} not found`);
    }
    return product;
};

/**
 * Add a new product.
 * @param {Object} productData - The product details.
 * @returns {Promise<Object>} Inserted product details.
 * @throws {BadRequestError} If product insertion fails.
 */
export const addProduct = async (productData) => {
    const newProduct = await productDatastore.insertProductIntoDB(productData);
    if (!newProduct) {
        throw new BadRequestError('Failed to add product');
    }
    return newProduct;
};
