import express from 'express';
const router = express.Router();
import { addProduct, getProducts, getProductById, } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/addProduct').post(protect, admin, addProduct);
router.route('/:id').delete(protect, admin,deleteProduct);
router.route('/:id').put(protect, admin,updateProduct);

export default router;

