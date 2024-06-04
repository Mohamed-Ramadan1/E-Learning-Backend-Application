import User from '../models/userModel.js';
import Enroll from '../models/courseEnrollModel.js';
import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';
import Instructor from '../models/InstructorModel.js';
import FinancialAidRequests from '../models/financialAidMode.js';
import Course from '../models/coursesModel.js';





// Site statics
export const siteStatics = catchAsync(async (req, res, next) => {
  const users = await User.countDocuments();
  const instructors = await Instructor.countDocuments();
  const reviews = await Review.countDocuments();
  const courses = await Course.countDocuments();
  const paidCourses = await Course.countDocuments({ paymentModel: 'paid' });
  const freeCourses = await Course.countDocuments({ paymentModel: 'free' });
  const enrollments = await Enroll.countDocuments();
  const activeAccounts = await User.countDocuments({ active: true });
  const inactiveAccounts = await User.countDocuments({ active: false });
  const verifiedAccounts = await User.countDocuments({ isVerified: true });
  const unverifiedAccounts = await User.countDocuments({
    isVerified: false,
  });
  const financialAidRequests = await FinancialAidRequests.countDocuments();
  const students = await User.countDocuments({ role: 'user' });
  const admins = await User.countDocuments({ role: 'admin' });

  res.status(200).json({
    status: 'success',
    data: {
      statics: {
        users,
        instructors,
        enrollments,
        reviews,
        courses,
        paidCourses,
        freeCourses,
        activeAccounts,
        inactiveAccounts,
        verifiedAccounts,
        unverifiedAccounts,
        students,
        admins,
        financialAidRequests,
      },
    },
  });
});


