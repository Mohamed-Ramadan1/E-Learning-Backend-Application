import { Router } from 'express';

import {
  getAllPaymentRecords,
  getPaymentRecord,
  updatePaymentRecord,
  deletePaymentRecord,
  createPaymentRecord,
} from '../controllers/paymentRecordsController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.route('/').post(createPaymentRecord);

router.use(restrictTo('admin'));
router.route('/').get(getAllPaymentRecords);
router
  .route('/:id')
  .get(getPaymentRecord)
  .patch(updatePaymentRecord)
  .delete(deletePaymentRecord);

export default router;
