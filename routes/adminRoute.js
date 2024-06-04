import { Router } from 'express';
import { siteStatics } from './../controllers/adminController.js';

import { restrictTo, protect } from './../middleware/authMiddleware.js';

const router = Router();

// * AUth middleware for admin
router.use(protect);
router.use(restrictTo('admin'));

//statics
router.route('/siteStatics').get(siteStatics);

export default router;
