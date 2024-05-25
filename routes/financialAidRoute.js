import { Router } from 'express';
import {
  createFinancialAidRequest,
  getFinancialAidRequest,
  getFinancialAidRequests,
  updateFinancialAidRequest,
  deleteFinancialAidRequest,
} from '../controllers/financialAidController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);

router.route('/').get(getFinancialAidRequests);
router.route('/').post(createFinancialAidRequest);
router
  .route('/:id')
  .get(getFinancialAidRequest)
  .patch(updateFinancialAidRequest)
  .delete(deleteFinancialAidRequest);

export default router;
