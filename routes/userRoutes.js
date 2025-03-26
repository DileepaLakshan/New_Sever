import express from 'express';
import {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  registerUser,
  updateUser,
  updateUserProfile,
  forgotPassword,	
  resetPassword,
  verifyEmail,
  googleLogin,
} from '../controllers/userController.js';
import { admin, protect, isadmin } from '../middleware/authMiddleware.js';


  const router = express.Router();
 
  router.route('/').post(registerUser).get(protect, admin, getUsers);
  router.post('/auth',  authUser);
  router.post('/google-login',  googleLogin);
  router.post('/adminAuth', isadmin,  authUser);
  router.post('/forgotpassword', forgotPassword);
  router.post('/verify-Email', verifyEmail);
  router.put('/resetpassword', resetPassword);
  router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

  router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser);
  
  
  export default router;