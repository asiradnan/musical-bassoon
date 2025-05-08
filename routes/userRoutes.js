import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
  googleAuth,
  facebookAuth,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);
router.route('/wishlist/:id').delete(protect, removeFromWishlist);
router.route('/auth/google').post(googleAuth);
router.route('/auth/facebook').post(facebookAuth);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;