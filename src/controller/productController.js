import * as service from '../service/service.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { createSuccessResponse } from '../builders/responseBuilder.js';
import camelcaseKeys from 'camelcase-keys';

/**
 * Controller function to handle fetching products.
 * @route GET /api/product
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @throws {DatastoreError} - If there is a service error.
 */
export const getProduct = asyncHandler(async (req, res) => {
    const products = await service.fetchProducts();
    res.json(createSuccessResponse(products));
});

/**
 * Controller function to handle fetching product by product Id.
 * @route GET /api/product/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @throws {DatastoreError} - If there is a service error.
 */
export const getProductById = asyncHandler(async (req, res) => {
    const product = await service.fetchProductById(req.params.id);
    const camelCasedProduct = camelcaseKeys(product, { deep: true });
    res.json(createSuccessResponse(camelCasedProduct, 'Product fetched successfully'));
});

/**
 * Controller function to handle adding product
 * @route POST /api/product
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @throws {DatastoreError} - If there is a service error.
 */
export const addProduct = asyncHandler(async (req, res) => {
    const product = await service.addProduct(req.body);
    res.status(201).json(createSuccessResponse(product, 'Product added successfully'));
});

/**
 * Controller function to handle updating product.
 * @route PUT /api/product/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @throws {DatastoreError} - If there is a service error.
 */
export const updateProduct = asyncHandler(async (req, res) => {
    const updatedProduct = await service.updateProduct(req.params.id, req.body);
    res.json(createSuccessResponse(updatedProduct, 'Product updated successfully'));
});

/**
 * Controller function to handle deleting product.
 * @route DELETE /api/product/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @throws {DatastoreError} - If there is a service error.
 */
export const deleteProduct = asyncHandler(async (req, res) => {
    try {
        await service.deleteProductById(req.params.id);
        res.json(createSuccessResponse(null, 'Product deleted successfully'));
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete the product' });
    }
});

export const uploadImage = asyncHandler(async (req, res) => {
    try {
        const { originalname, buffer, mimetype } = req.file;

        const imageId = await service.storeImage(originalname, buffer, mimetype);
        res.status(200).json({ message: 'Image uploaded successfully', imageId });
    } catch (error) {
        console.log(error);
    }
});

export const getImageById = asyncHandler(async (req, res) => {
    const image = await service.fetchImageById(req.params.id);

    if (!image) return res.status(404).send('Image not found');

    res.set('Content-Type', image.mimetype);
    res.send(image.data);
});
