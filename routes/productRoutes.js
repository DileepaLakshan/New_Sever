import express from 'express';
const router = express.Router();
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct, getProducts2, addReview, deleteReview, updatedReview, getProductReview } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts);
router.route('/2').get(getProducts2);
router.route('/:id').get(getProductById);
router.route('/reviews/:id').post(protect, addReview).delete(protect, deleteReview).put(protect, updatedReview).get(getProductReview);
router.route('/addProduct').post(protect, admin, addProduct);
router.route('/:id').delete(protect, admin,deleteProduct);
router.route('/:id').put(protect, admin,updateProduct);

export default router;

