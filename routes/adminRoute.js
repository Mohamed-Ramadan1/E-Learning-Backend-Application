import { Router } from 'express';
import { siteStatics } from './../controllers/adminController.js';

import {
  approveFinancialAidRequest,
  rejectFinancialAidRequest,
  getAllFinancialAidRequestsAdmin,
  getFinancialAidRequestAdmin,
  deleteFinancialAidRequestAdmin,
} from '../controllers/financialAidController.js';

import { restrictTo, protect } from './../middleware/authMiddleware.js';

const router = Router();

// * AUth middleware for admin
router.use(protect);
router.use(restrictTo('admin'));

//statics
router.route('/siteStatics').get(siteStatics);

//Financial Aid Requests end points
router
  .route('/financialAidRequests/:id/approve')
  .patch(approveFinancialAidRequest);
router
  .route('/financialAidRequests/:id/reject')
  .patch(rejectFinancialAidRequest);
router.route('/financialAidRequests').get(getAllFinancialAidRequestsAdmin);
router.route('/financialAidRequests/:id').get(getFinancialAidRequestAdmin);
router
  .route('/financialAidRequests/:id')
  .delete(deleteFinancialAidRequestAdmin);

export default router;
