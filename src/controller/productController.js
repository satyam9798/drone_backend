import * as service from '../service/service.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { createSuccessResponse } from '../builders/responseBuilder.js';

/**
 * Controller function to handle fetching products.
 * @route GET /api/products
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @throws {DatastoreError} - If there is a service error.
 */
export const getProducts = asyncHandler(async (req, res) => {
    const products = await service.fetchProducts();
    const a = 5;
    res.json(createSuccessResponse(products));
});
