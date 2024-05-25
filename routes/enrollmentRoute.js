import { Router } from 'express';
import {
  deleteEnrollment,
  enrollOnCourse,
  getAllEnrollments,
  getEnrollment,
  getAllEnrolledUserOnCourse,
  getEnrollmentsByUser,
} from '../controllers/courseEnrollmentController.js';
import { protect, restrictTo } from './../middleware/authMiddleware.js';

const router = Router();

router
  .route('/')
  .get(protect, restrictTo('admin'), getAllEnrollments)
  .post(protect, enrollOnCourse);

router
  .route('/enrolledUsers/:courseId')
  .get(protect, restrictTo('admin'), getAllEnrolledUserOnCourse);

router
  .route('/:id')
  .get(protect, getEnrollment)
  .delete(protect, restrictTo('admin'), deleteEnrollment);

router.route('/user/:id').get(protect, getEnrollmentsByUser);
export default router;
