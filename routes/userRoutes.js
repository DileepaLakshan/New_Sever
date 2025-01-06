import express from 'express';
import {
    registerUser,
    logoutUser,
    getUsers,
    authUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    getUserById

  } from '../controllers/userController.js';
  import { admin, protect, isadmin } from '../middleware/authMiddleware.js';
 
  const router = express.Router();
 
  router.route('/').post(registerUser).get(protect, admin, getUsers);
  router.post('/auth',  authUser);
  router.post('/adminAuth', isadmin,  authUser);
  router.post('/logout', logoutUser);
  router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
  router.route('/:id').delete(protect, isadmin, deleteUser).get(protect, isadmin, getUserById);
  
  
  export default router;