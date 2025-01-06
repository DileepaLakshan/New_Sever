import express from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have auth middleware

const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addItemToCart).delete(protect,clearCart);
router.route('/:productId').put(protect, updateCartItem).delete(protect, removeItemFromCart);

export default router;
