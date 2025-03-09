import * as service from '../service/service.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { createSuccessResponse } from '../builders/responseBuilder.js';

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
    const updatedProduct = await service.fetchProductById(req.params.id);
    res.json(createSuccessResponse(updatedProduct, 'Product updated successfully'));
});

/**
 * Controller function to handle adding product
 * @route POST /api/product
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @throws {DatastoreError} - If there is a service error.
 */
export const addProduct = asyncHandler(async (req, res) => {
    const product = await service.createProduct(req.body);
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
    await service.deleteProduct(req.params.id);
    res.json(createSuccessResponse(null, 'Product deleted successfully'));
});
