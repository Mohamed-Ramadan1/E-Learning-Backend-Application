import { Router } from 'express';
import {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
  allBlogsPosts,
  blogPost,
  publishBlog,
  unPublishBlog,
  deleteBlogPost,
} from './../controllers/blogController.js';
import { protect, restrictTo } from './../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(getAllBlogs);

router.use(protect);

router.route('/').post(createBlog);

router.route('/myBlogs').get(getMyBlogs);

//admin routes
router.route('/allBlogsPosts').get(restrictTo('admin'), allBlogsPosts);
router.route('/blogsPosts/:id').get(restrictTo('admin'), blogPost);
router.route('/blogsPosts/:id').delete(restrictTo('admin'), deleteBlogPost);

//not admin route
router.route('/:id').get(getBlog).patch(updateBlog).delete(deleteBlog);

//admin route
router.route('/:id/published').patch(restrictTo('admin'), publishBlog);
router.route('/:id/notPublished').patch(restrictTo('admin'), unPublishBlog);

export default router;
