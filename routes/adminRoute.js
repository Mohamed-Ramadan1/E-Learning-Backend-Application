import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
  unActivateUser,
  activateUser,
  verifyUser,
  getAllInstructors,
  getInstructor,
  createInstructor,
  deleteInstructor,
  siteStatics,
  freeCourses,
  paidCourses,
  approveEnrollment,
  cancelEnrollment,
  activateInstructor,
  deactivateInstructor,
  getAllBlogs,
  publishBlog,
  unPublishBlog,
  deleteBlog,
} from './../controllers/adminController.js';

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

//Users end points
router.route('/getAllUsers').get(getAllUsers);
router.route('/createUser').post(createUser);
router.route('/getUser/:id').get(getUser);
router.route('/deleteUser/:id').delete(deleteUser);
router.route('/updateUser/:id').patch(updateUser);
router.route('/unActivateUser/:id').patch(unActivateUser);
router.route('/activateUser/:id').patch(activateUser);
router.route('/verifyUser/:id').patch(verifyUser);

// Instructors end points
router.route('/getAllInstructors').get(getAllInstructors);
router.route('/getInstructor/:id').get(getInstructor);
router.route('/createInstructor').post(createInstructor);
router.route('/deleteInstructor/:id').delete(deleteInstructor);
router.route('/activateInstructor/:id').patch(activateInstructor);
router.route('/deactivateInstructor/:id').patch(deactivateInstructor);

//statics
router.route('/siteStatics').get(siteStatics);

//Courses end points
router.route('/freeCourses').get(freeCourses);
router.route('/paidCourses').get(paidCourses);
router.route('/approveEnrollment/:id').patch(approveEnrollment);
router.route('/cancelEnrollment/:id').patch(cancelEnrollment);

//Blogs end points
router.route('/getAllBlogs').get(getAllBlogs);
router.route('/publishBlog/:id').patch(publishBlog);
router.route('/unPublishBlog/:id').patch(unPublishBlog);
router.route('/deleteBlog/:id').delete(deleteBlog);

//Financial Aid Requests end points
router
  .route('/approveFinancialAidRequest/:id')
  .patch(approveFinancialAidRequest);
router.route('/rejectFinancialAidRequest/:id').patch(rejectFinancialAidRequest);
router
  .route('/getAllFinancialAidRequests')
  .get(getAllFinancialAidRequestsAdmin);
router.route('/getFinancialAidRequest/:id').get(getFinancialAidRequestAdmin);
router
  .route('/deleteFinancialAidRequest/:id')
  .delete(deleteFinancialAidRequestAdmin);

export default router;
