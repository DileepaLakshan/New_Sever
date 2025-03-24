import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import User from "../models/userModel.js";


// @desc    add a new product
// @route   POST /api/addProduct
// @access  Public
const addProduct = asyncHandler(async (req, res) => {
  
  console.log(req.body);

    const { name, image, category, description, price, modelImageUrl, imageUrl,countInStock } = req.body;
  
  
    const user = await User.findById(req.user._id);
    console.log(`imageurl:${imageUrl}`);
  
    const product = await Product.create({
      user,
      name,
      image,
      category,
      description,
      price,
      modelImageUrl,
      imageUrl,
      countInStock,
    });
  
  
    if (product) {
      res.status(201).json({
        success: true,
        message: "Product added successfully",
        _id: product._id,
        name: product.name,
        image: product.image,
        category: product.category,
        description: product.description,
        price: product.price,
        countInStock: product.countInStock,
        success: true, // Include the 'success' field for frontend validation
        message: "Product added successfully",
      });
    } else {
      res.status(400).json({
        success: false, // Send success as false in case of failure
        message: 'Invalid product data', // Failure message
      });
    }
  });



// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).select('-imageUrl');
    res.status(200).json(products); // Explicitly set status 200
  });



// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);
  
    if (product) {
      return res.json(product);
    }
  
    res.status(404);
    throw new Error('Resource not found');
  
  });




// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = asyncHandler(async (req, res) => {
  const { name, image, category, description, price ,countInStock} = req.body;

  // Find the product by ID
  const product = await Product.findById(req.params.id);

  if (product) {

    // If a quantity is provided, update the stock
    if (quantity !== undefined) {
      if (product.countInStock < quantity) {
        res.status(400);
        throw new Error('Not enough stock available');
      }
      // Deduct stock quantity
      product.countInStock -= quantity;
    }
    // Update the product's fields
    product.name = name || product.name;
    product.image = image || product.image;
    product.category = category || product.category;
    product.description = description || product.description;
    product.price = price || product.price;
    product.countInStock = countInStock || product.countInStock;
    // Save the updated product
    const updatedProduct = await product.save();

    // Send the updated product in the response
    res.status(200).json({
      _id: updatedProduct._id,
      name: updatedProduct.name,
      image: updatedProduct.image,
      category: updatedProduct.category,
      description: updatedProduct.description,
      price: updatedProduct.price,
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});



// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


// @desc    Fetch all products in moble
// @route   GET /api/products
// @access  Public
const getProducts2 = asyncHandler(async (req, res) => {
  const products = await Product.find({}).select("-image");
  res.status(200).json(products); // Explicitly set status 200
});




// @desc    Add Product Review
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Find the product by ID
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if the user has already reviewed the product
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed by this user');
  }

  // Create a new review
  const review = {
    user: req.user._id,
    name: user.name,
    rating: Number(rating),
    comment,
  };

  // Add the review to the product's reviews array
  product.reviews.push(review);

  // Recalculate the product's average rating
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, review) => acc + review.rating, 0) /
    product.numReviews;

  // Save the updated product
  await product.save();

  res.status(201).json({ message: 'Review added successfully' });
});



// @desc    Delete Product Review
// @route   DELETE /api/products/:id/reviews
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const { review_id } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Find the product by ID
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Find the review index in the product's reviews array
  const reviewIndex = product.reviews.findIndex(
    (review) => review._id.toString() === review_id
  );

  if (reviewIndex !== -1) {
    const review = product.reviews[reviewIndex];

    // Check if the logged-in user is the one who wrote the review
    if (review.user.toString() === req.user._id.toString()) {
      product.reviews.splice(reviewIndex, 1); // Remove the review
      product.numReviews = product.reviews.length;

      // Recalculate average rating
      if (product.numReviews > 0) {
        product.rating =
          product.reviews.reduce((acc, review) => acc + review.rating, 0) /
          product.numReviews;
      } else {
        product.rating = 0;
      }

      await product.save();

      res.json({ message: 'Review removed successfully' });
    } else {
      res.status(403); // Forbidden
      throw new Error('You can only delete your own reviews');
    }
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

// @desc    Get product review by ID
// @route   GET /api/products/reviews/:id
// @access  Public
const getProductReview = asyncHandler(async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);

    if (product) {
      // Construct the review response
      const review = {
        reviews: product.reviews,
        rating: product.rating,
        numReviews: product.numReviews
      };

      res.status(200).json(review);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// @desc    Update Product Review
// @route   PUT /api/products/:id/reviews
// @access  Private
const updatedReview = asyncHandler(async (req, res) => {
  const { review_id, rating, comment } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Find the product by ID
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Find the review by ID
  const review = product.reviews.find(
    (r) => r._id.toString() === review_id
  );

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if the logged-in user is the one who wrote the review
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only update your own reviews');
  }

  // Update the review fields
  review.rating = rating;
  review.comment = comment;

  // Recalculate average rating
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();

  res.json({ message: 'Review updated successfully' });
});





export { addProduct, getProductById, getProducts, updateProduct, deleteProduct, getProducts2, addReview, deleteReview, updatedReview, getProductReview };

