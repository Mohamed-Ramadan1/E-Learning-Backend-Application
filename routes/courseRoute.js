import { Router } from 'express';
const router = Router();
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from './../controllers/coursesController.js';
import upload from './../middleware/multerMiddleware.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

router
  .route('/')
  .get(getAllCourses)
  .post(protect, restrictTo('admin'), upload.single('photo'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .patch(protect, restrictTo('admin'), updateCourse)
  .delete(protect, restrictTo('admin'), deleteCourse);

export default router;
