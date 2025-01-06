import express from 'express';
import {
  getCart,
  addItemToCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have auth middleware

const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addItemToCart);


export default router;
