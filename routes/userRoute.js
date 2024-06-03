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
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
  unActivateUser,
  activateUser,
  verifyUser,
} from './../controllers/userController.js';

import { protect, restrictTo } from './../middleware/authMiddleware.js';
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

router.use(restrictTo('admin'));
//Users end points
router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

router.route('/:id/inactive').patch(unActivateUser);
router.route('/:id/active').patch(activateUser);
router.route('/:id/verify').patch(verifyUser);

export default router;
