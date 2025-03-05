import express from 'express';
import { getProducts } from '../controller/productController.js';

const router = express.Router();

/**
 * Route to fetch products.
 * @route GET /api/products
 */
router.get('/products', getProducts);

export default router;
