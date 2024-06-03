import { Router } from 'express';
import {
  getAllInstructors,
  getInstructor,
  createInstructor,
  deleteInstructor,
  activateInstructor,
  deactivateInstructor,
  updateInstructor,
} from './../controllers/instructorController.js';

import { restrictTo, protect } from './../middleware/authMiddleware.js';

const router = Router();

// * AUth middleware for admin
router.use(protect);
router.use(restrictTo('admin'));

// Instructors end points
router.route('/').get(getAllInstructors).post(createInstructor);
router
  .route('/:id')
  .get(getInstructor)
  .delete(deleteInstructor)
  .patch(updateInstructor);

router.route('/:id/active').patch(activateInstructor);
router.route('/:id/inactive').patch(deactivateInstructor);

export default router;
