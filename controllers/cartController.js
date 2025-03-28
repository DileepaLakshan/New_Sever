import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';


// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity ,countInStock } = req.body;
  
    const user = await User.findById(req.user._id);
  
    if (user) {
      const existingItem = user.cart.find((item) => item.productId.toString() === productId);
  
      if (existingItem) {
        // Update quantity if the item already exists
        existingItem.quantity += quantity;
      } else {
        // Add new item to the cart
        user.cart.push({ productId, quantity,});
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
// const getCart = asyncHandler(async (req, res) => {

//     if (!req.user) {
//       res.status(401);
//       throw new Error('Unauthorized');
//     }
//     const user = await User.findById(req.user._id).populate('cart.productId'); // Populate product details
    
//     if (!user) {
//       res.status(404);
//       throw new Error('User not found');
//     }
  
//     // Retrieve detailed product information for each item in the cart
//     const cartDetails = await Promise.all(
//       user.cart.map(async (item) => {
//         const product = await Product.findById(item.productId);
//         return {
//           productId: product._id,
//           name: product.name,
//           price: product.price,
//           image: product.image,
//           quantity: item.quantity, // Assuming you store quantity in the cart
//           countInStock: item.productId.countInStock,
//         };
//       })
//     );
  
//     res.status(200).json(cartDetails);
//   });

const getCart = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  // Retrieve user from database and populate cart.productId
  const user = await User.findById(req.user._id).populate("cart.productId");

  // Log the user to check if user data is fetched correctly
  console.log("Fetched user:", user);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Retrieve detailed product information for each item in the cart
  const cartDetails = await Promise.all(
    user.cart.map(async (item) => {
      // Check if productId exists for this cart item
      if (!item.productId) {
        console.warn(`Cart item missing product reference:`, item);
        return null; // Skip this cart item if product is missing
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        console.warn(`Product with ID ${item.productId} not found.`);
        return null; // Skip if product is not found
      }

      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity, // Assuming you store quantity in the cart
        countInStock: product.countInStock, // Get stock count from product
      };
    })
  );

  // Remove any null entries caused by missing products
  const filteredCartDetails = cartDetails.filter((item) => item !== null);

  // Respond with the filtered cart details
  res.status(200).json(filteredCartDetails);
});



// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity,countInStock } = req.body;
  
    const user = await User.findById(req.user._id);
  
    if (user) {
      const item = user.cart.find((item) => item.productId.toString() === req.params.productId);
  
      if (item) {
        item.quantity = quantity;
        if(item.quantity <= 0) {
            user.cart = user.cart.filter((item) => item.productId.toString() !== req.params.productId);
        }
        await user.save();
        res.json(user.cart);
      } else {
        res.status(404);
        throw new Error('Item not found in cart');
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });



// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeItemFromCart = asyncHandler(async (req, res) => {
  console.log("ded");
    const user = await User.findById(req.user._id);
  
    if (user) {
      user.cart = user.cart.filter((item) => item.productId.toString() !== req.params.productId);
      await user.save();
      res.json(user.cart);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });


  
  // @desc    Clear cart
  // @route   DELETE /api/cart
  // @access  Private
  const clearCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (user) {
      user.cart = [];
      await user.save();
      res.json(user.cart);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });
  


  export {
    addItemToCart, getCart, updateCartItem, removeItemFromCart, clearCart
  };