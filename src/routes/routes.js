import express from 'express';
import {
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
} from '../controller/productController.js';

const router = express.Router();

/**
 * Route to fetch products.
 * @route GET /api/products
 */
router.get('/product', getProduct);
router.get('/product/:id', getProductById);

router.post('/product/', addProduct); // Add a new product
router.put('/product/:id', updateProduct); // Update a product
router.delete('/product/:id', deleteProduct);

export default router;
