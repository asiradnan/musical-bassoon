import express from 'express';
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
} from '../controllers/blogController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getBlogs).post(protect, admin, createBlog);
router.route('/category/:category').get(getBlogsByCategory);
router
  .route('/:id')
  .get(getBlogById)
  .put(protect, admin, updateBlog)
  .delete(protect, admin, deleteBlog);

export default router;