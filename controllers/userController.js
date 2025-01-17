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
});



// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {

  
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if(user && (await user.matchPassword(password))) {

    console.log(user._id);

    const token = genrateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }


});



// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  try {
    const data = await User.find();

    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
    });
  }
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


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.contactNumber1 = req.body.contactNumber1 || user.contactNumber1;
    user.contactNumber2 = req.body.contactNumber2 || user.contactNumber2;
    user.shippingAddress = req.body.shippingAddress || user.shippingAddress;
  }

  if(req.body.password) {
    user.password = req.body.password;
  }

  const updateUser = await user.save();

  res.status(200).json({
    _id: updateUser._id,
    name: updateUser.name,
    email: updateUser.email,
  })
});


// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {

  const user = await User.findById(req.params.id);
  
    if (user) {
      return res.json(user);
    }
  
    res.status(404);
    throw new Error('User not found');
});





export {
    registerUser, logoutUser, getUserProfile, authUser, getUsers, updateUserProfile, deleteUser, getUserById
  };