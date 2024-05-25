import { Router } from 'express';
import {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} from './../controllers/blogController.js';
import { protect } from './../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(getAllBlogs);

router.use(protect);

router.route('/').post(createBlog);

router.route('/myBlogs').get(getMyBlogs);

router.route('/:id').get(getBlog).patch(updateBlog).delete(deleteBlog);

export default router;
