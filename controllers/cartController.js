import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';


// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, price, name } = req.body;
  
    const user = await User.findById(req.user._id);
  
    if (user) {
      const existingItem = user.cart.find((item) => item.productId.toString() === productId);
  
      if (existingItem) {
        // Update quantity if the item already exists
        existingItem.quantity += quantity;
      } else {
        // Add new item to the cart
        user.cart.push({ productId, quantity, price,name,image });
      }
  
      await user.save();
      res.status(201).json(user.cart);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });


  

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart.productId'); // Populate product details
  
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    // Retrieve detailed product information for each item in the cart
    const cartDetails = await Promise.all(
      user.cart.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity, // Assuming you store quantity in the cart
        };
      })
    );
  
    res.status(200).json(cartDetails);
  });
  


  export {
    addItemToCart, getCart
  };