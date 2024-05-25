import { Router } from 'express';
import {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  getCourseReviews,
} from '../controllers/reviewsController.js';
import { protect } from './../middleware/authMiddleware.js';
const router = Router();

router.route('/').get(protect, getAllReviews).post(protect, createReview);

//Get All reviews On specific course
router.route('/courseReviews/:courseId').get(protect, getCourseReviews);

router
  .route('/:id')
  .get(protect, getReview)
  .patch(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
