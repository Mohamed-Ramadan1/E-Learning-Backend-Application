import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllUsersNotes,
  getUserNote,
  createUserNote,
  updateUserNote,
  deleteUserNote,
} from '../controllers/userCoursesNotesController.js';

const router = Router();
router.use(protect);

router.route('/').get(getAllUsersNotes).post(createUserNote);

router
  .route('/:id')
  .get(getUserNote)
  .patch(updateUserNote)
  .delete(deleteUserNote);

export default router;
