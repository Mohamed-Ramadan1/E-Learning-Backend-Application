import { Router } from 'express';
import {
  createFinancialAidRequest,
  getFinancialAidRequest,
  getFinancialAidRequests,
  updateFinancialAidRequest,
  deleteFinancialAidRequest,
  ////////////////////////////////
  approveFinancialAidRequest,
  rejectFinancialAidRequest,
  getAllFinancialAidRequestsAdmin,
  getFinancialAidRequestAdmin,
  deleteFinancialAidRequestAdmin,
} from '../controllers/financialAidController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);

router.route('/').get(getFinancialAidRequests);
router.route('/').post(createFinancialAidRequest);

router
  .route('/allRequests')
  .get(restrictTo('admin'), getAllFinancialAidRequestsAdmin);

router
  .route('/:id')
  .get(getFinancialAidRequest)
  .patch(updateFinancialAidRequest)
  .delete(deleteFinancialAidRequest);

//Financial Aid Requests end points
router.use(restrictTo('admin'));
router.route('/request:id').get(getFinancialAidRequestAdmin);
router.route('/:id/approve').patch(approveFinancialAidRequest);
router.route('/:id/reject').patch(rejectFinancialAidRequest);
router.route('/deleteRequest/:id').delete(deleteFinancialAidRequestAdmin);

export default router;
