import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllWishlistItems,
  getWishlistItem,
  createWishlistItem,
  deleteWishlistItem,
  checkCourseInWishlist,
  removeItemFromWishlist,
} from '../controllers/wishlistController.js';
const router = Router();

router.use(protect);

router.route('/').get(getAllWishlistItems).post(createWishlistItem);

router.route('/check').post(checkCourseInWishlist);

router.route('/remove/:courseId').delete(removeItemFromWishlist);

router.route('/:id').get(getWishlistItem).delete(deleteWishlistItem);

export default router;
