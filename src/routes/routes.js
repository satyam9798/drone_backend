import express from 'express';
import {
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    uploadImage,
    getImageById,
} from '../controller/productController.js';

import multer from 'multer';
import { initiatePayment, paymentCallback } from '../controller/paymentController.js';
import { getCategories } from '../controller/categoriesController.js';
import { query } from '../datastore/dbClient.js';
import { deleteImageController, getAllImages } from '../controller/imageController.js';

const upload = multer();

const router = express.Router();
// test
router.get('/', (_, res) => {
    res.send(`Welcome Zemlabs Drone Server`);
});

/**
 * Route to fetch products.
 * @route GET /api/products
 */
router.get('/product', getProduct);
router.get('/product/:id', getProductById);

router.post('/product/', addProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

router.get('/categories/', getCategories);

router.post('/image/upload', upload.single('image'), uploadImage);
router.get('/image/:id', getImageById);

router.get('/admin/images', getAllImages);

router.delete('/image/:id', deleteImageController);

router.post('/initiate-payment', initiatePayment);

router.get('/payment-callback', paymentCallback);

export default router;
