import { Router } from 'express';
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from './../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').post(protect, logout);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').post(resetPassword);
router.route('/verify-email/:emailToken').get(verifyEmail);

export default router;
