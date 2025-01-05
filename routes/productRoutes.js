import express from 'express';
const router = express.Router();
import { addProduct, getProducts, getProductById, } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/addProduct').post(protect, admin, addProduct);

export default router;

