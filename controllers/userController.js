import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import genrateToken from "../utils/generatetoken.js";
import sendEmail from "../utils/sendEmail.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { json } from "express";
import emailTemplate from "../assets/email.js";
import { error } from "console";


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if(!user)
  {
      res.status(401);
      throw new Error("Invalid email");
  }

  if (user && (await user.matchPassword(password))) {
    const token = genrateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // console.log('hiiii');

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

 

  if (user) {
    genrateToken(res, user._id);

    const token = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    console.log(user.email);

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/verifyEmail`;
    console.log(resetUrl);
  
    await sendEmail(
      user.email,
      "Verify Email",
      `Copy this code : ${token}
      Use this Code to verify user email \n\n
      `
    );
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


const verifyEmail = asyncHandler(async (req, res) => {

const {email, token} = req.body;

const userExist = await User.findOne({ email });

if(!userExist)
{
    res.status(404);
    throw new Error("User not found");
}
console.log(token);
if(!token){
  res.status(400);
  throw new Error("Token Empty ");
}

const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });


if (!user) {
  res.status(400);
  throw new Error("Invalid token");
}


res.status(200).json({ message: "Email verified successfully" });



})





// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
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
  } else {
  
    res.status(404);
    throw new Error("User not found");
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

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updateUser = await user.save();

  res.status(200).json({
    _id: updateUser._id,
    name: updateUser.name,
    email: updateUser.email,
  });
});

// @desc    Forgot password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({
      error: "No user found",
    });
    throw new Error("User not found");
  }

  // Generate and set password reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL with HTTPS
  const resetUrl = `https://${req.get("host")}/api/users/resetpassword`;
  console.log(resetUrl);
  console.log("test25");

  // Send email
  try {
    console.log("test26");
    console.log(user.email);
    await sendEmail(
      user.email,
      "Password Reset Request",
      `Copy this code: ${resetToken}
      Use this link to reset your password: \n\n${resetUrl}`
    );
    console.log("test27");
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log("test28");
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    console.log("Email not sent");
    throw new Error("Email could not be sent");
  }
});


// @desc    Reset password
// @route   PUT /api/users/resetpassword
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid token");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.send("get users");
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send("delete user");
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  res.send("get user by id");
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("update user");
});

export {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  logoutUser,
  registerUser,
  updateUser,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  verifyEmail
};
