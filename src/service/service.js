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

export const updateProduct = async (id, data) => {
    const result = await productDatastore.updateProductIntoDB(id, data);
    return result.id;
};

export const storeImage = async (id, payload) => {
    const result = await productDatastore.insertImage(id, payload);
    return result.id;
};

export const fetchImageById = async (id) => {
    const image = await productDatastore.getImage(id);
    return image;
};

export const fetchAllImages = async () => {
    const images = await productDatastore.getAllImage();
    const linked = {};
    const unlinked = [];

    images.rows.forEach((img) => {
        if (img.product_id) {
            if (!linked[img.image_id]) {
                linked[img.image_id] = { ...img, products: [] };
            }
            linked[img.image_id].products.push({
                id: img.product_id,
                title: img.product_title,
            });
        } else {
            unlinked.push({ id: img.image_id, filename: img.filename });
        }
    });

    const data = {
        unlinked,
        linked,
    };

    return data;
};

export const deleteImageById = async (imageId) => {
    // check if the image is unlinked before deleting
    const isLinked = await productDatastore.checkImageLinking(imageId);

    if (isLinked.rows.length > 0) {
        throw new Error('image_linked');
    }

    await productDatastore.deleteImageById(imageId);
};

export const deleteProductById = async (productId) => {
    await productDatastore.deleteProductById(productId);
};
