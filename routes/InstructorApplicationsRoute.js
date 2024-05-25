import { Router } from 'express';
import {
  createInstructorApplication,
  getInstructorApplications,
  getInstructorApplication,
  updateInstructorApplication,
  deleteInstructorApplication,
  approveInstructorApplication,
  rejectInstructorApplication,
} from '../controllers/InstructorApplicationsController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').post(createInstructorApplication);

router.use(protect);
router.use(restrictTo('admin'));

router.route('/').get(getInstructorApplications);

router
  .route('/:id')
  .get(getInstructorApplication)
  .patch(updateInstructorApplication)
  .delete(deleteInstructorApplication);

router.route('/:id/approve').patch(approveInstructorApplication);
router.route('/:id/reject').patch(rejectInstructorApplication);
export default router;
