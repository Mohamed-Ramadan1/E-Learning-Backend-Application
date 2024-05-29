import User from '../models/userModel.js';
import Tasks from '../models/taskModel.js';
import Enroll from '../models/courseEnrollModel.js';
import Blog from '../models/blogModel.js';
import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';
import Instructor from '../models/InstructorModel.js';
import FinancialAidRequests from '../models/financialAidMode.js';
import Course from '../models/coursesModel.js';
import APIFeatures from '../utils/apiKeyFeatures.js';
import UserCoursesNotes from '../models/userCoursesNotesModel.js';

import AppError from '../utils/appError.js';

import { getOne, createOne, updateOne } from './factoryHandler.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUser = getOne(User);

export const createUser = createOne(User);

export const updateUser = updateOne(User);

export const deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  await Enroll.deleteMany({ user: req.params.id });
  await Review.deleteMany({ user: req.params.id });
  await Tasks.deleteMany({ createdBy: req.params.id });
  await Blog.deleteMany({ createdBy: req.params.id });
  await FinancialAidRequests.deleteMany({ user: req.params.id });
  await UserCoursesNotes.deleteMany({ user: req.params.id });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// unActivate user account

export const unActivateUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// Activate user account

export const activateUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: true });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// Verify user account

export const verifyUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, {
    isVerified: true,
    emailToken: null,
  });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

//Instructor operations (create , delete , update , get all , get one)

export const getAllInstructors = catchAsync(async (req, res, next) => {
  //adding pagination and other api key fetaures

  // const instructors = await Instructor.find();

  const features = new APIFeatures(Instructor.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const instructors = await features.query;

  res.status(200).json({
    status: 'success',
    results: instructors.length,
    data: {
      instructors,
    },
  });
});

export const getInstructor = catchAsync(async (req, res, next) => {
  const instructor = await Instructor.findById(req.params.id);
  if (!instructor) {
    return next(new AppError('No instructor found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      instructor,
    },
  });
});

export const createInstructor = catchAsync(async (req, res, next) => {
  const newInstructor = await Instructor.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      instructor: newInstructor,
    },
  });
});

export const deleteInstructor = catchAsync(async (req, res, next) => {
  await Instructor.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// extra operations for instructors
// activate instructor account

export const activateInstructor = catchAsync(async (req, res, next) => {
  await Instructor.findByIdAndUpdate(req.params.id, { status: 'active' });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// deactivate instructor account

export const deactivateInstructor = catchAsync(async (req, res, next) => {
  await Instructor.findByIdAndUpdate(req.params.id, { status: 'inactive' });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

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

// Get all free courses
export const freeCourses = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Course.find({ paymentModel: 'free' }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const courses = await features.query;

  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
      courses,
    },
  });
});

// Get all paid courses
export const paidCourses = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Course.find({ paymentModel: 'paid' }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const courses = await features.query;

  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
      courses,
    },
  });
});

// Control enrollments status

//change enrollment status to approved
export const approveEnrollment = catchAsync(async (req, res, next) => {
  await Enroll.findByIdAndUpdate(req.params.id, {
    enrollmentStatus: 'approved',
  });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

//change enrollment status to cancelled
export const cancelEnrollment = catchAsync(async (req, res, next) => {
  await Enroll.findByIdAndUpdate(req.params.id, {
    enrollmentStatus: 'cancelled',
  });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

//Blogs
export const getAllBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find();
  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

// publish a blog
export const publishBlog = catchAsync(async (req, res, next) => {
  await Blog.findByIdAndUpdate(req.params.id, { published: true });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// unpublish a blog
export const unPublishBlog = catchAsync(async (req, res, next) => {
  await Blog.findByIdAndUpdate(req.params.id, { published: false });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

//delete a blog
export const deleteBlog = catchAsync(async (req, res, next) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
