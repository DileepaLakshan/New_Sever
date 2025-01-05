import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import User from "../models/userModel.js";


// @desc    add a new product
// @route   POST /api/addProduct
// @access  Public
const addProduct = asyncHandler(async (req, res) => {

    const { name, image, category, description, price } = req.body;
  
  
    const user = await User.findById(req.user._id);
  
    const product = await Product.create({
      user,
      name,
      image,
      category,
      description,
      price
    });
  
  
    if (product) {
      res.status(201).json({
        _id: product._id,
        name: product.name,
        image: product.image,
        category: product.category,
        description: product.description,
        price: product.price,
      });
    } else {
      res.status(400);
      throw new Error('Invalid product data');
    }
  });



// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
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


export { addProduct, getProductById, getProducts };

