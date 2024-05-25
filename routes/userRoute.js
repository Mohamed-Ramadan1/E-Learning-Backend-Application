import { Router } from 'express';
import {
  updatePassword,
  updateUserData,
  deleteMyAccount,
  unActivateMe,
  getMe,
  getMyCourses,
  getMyTasks,
  getMyReviews,
} from './../controllers/userController.js';

import { protect } from './../middleware/authMiddleware.js';
import upload from './../middleware/multerMiddleware.js';
const router = Router();

router.use(protect);

router.route('/updatePassword').post(updatePassword);

router.route('/updateInfo').patch(upload.single('photo'), updateUserData);

router.route('/unActivateMe').patch(unActivateMe);

router.route('/deleteMe').delete(deleteMyAccount);

router.route('/me').get(getMe);

router.route('/me/courses').get(getMyCourses);

router.route('/me/tasks').get(getMyTasks);

router.route('/me/reviews').get(getMyReviews);

export default router;
