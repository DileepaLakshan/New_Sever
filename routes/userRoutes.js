import express from 'express';
import {
    registerUser,
    logoutUser,
    getUsers,
    authUser,
  } from '../controllers/userController.js';
  import { admin, protect, isadmin } from '../middleware/authMiddleware.js';
 
  const router = express.Router();
 
  router.route('/').post(registerUser).get(protect, admin, getUsers);
  router.post('/auth',  authUser);
  router.post('/adminAuth', isadmin,  authUser);
  
  
  export default router;