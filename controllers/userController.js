import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import genrateToken from '../utils/generatetoken.js';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  

  const userExist = await User.findOne( {email} );

  if (userExist) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password
  });

  
  if(user) {
    genrateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }else {
    res.status(400);
    throw new Error('Invalid user data');
  }
    

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ message: 'Logged out successfully'});
});



// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
 
  const user = await User.findById(req.user._id);

  if(user) {

    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      lastName: user.lastName,
      contactNumber1: user.contactNumber1,
      contactNumber2: user.contactNumber2,
      shippingAddress: user.shippingAddress,

    });
  }else {
    res.status(404);
    throw new Error('User not found');
  }
});


export {
    registerUser,logoutUser,getUserProfile
  };