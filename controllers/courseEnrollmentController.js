import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiKeyFeatures.js';
import Enroll from '../models/courseEnrollModel.js';
import User from '../models/userModel.js';
import Course from '../models/coursesModel.js';
import FinancialAidRequests from '../models/financialAidMode.js';

import { deleteOne } from './factoryHandler.js';

export const enrollOnCourse = catchAsync(async (req, res, next) => {
  const courseId = req.body.course;
  const userId = req.body.user || req.user._id;

  const course = await Course.findById(courseId);
  const user = await User.findById(userId);

  if (!course || !user) {
    return next(
      new AppError('Invalid data  please provide all required data', 400),
    );
  }

  const previousEnrollments = await Enroll.findOne({ course, user });
  if (previousEnrollments) {
    return next(new AppError('User already enroll on this course', 400));
  }

  // if applay to financial aid delete the request
  await FinancialAidRequests.findOneAndDelete({
    course: courseId,
    user: userId,
  });

  const enrollObj = {
    course: course._id,
    user: user._id,
    price: course.price,
  };

  const newEnrollment = await Enroll.create(enrollObj);

  res
    .status(201)
    .json({ status: 'success to enroll', data: { newEnrollment } });
});

export const getAllEnrolledUserOnCourse = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  if (!courseId) {
    return next(new AppError('Please provide the course Id', 400));
  }

  const enrolledUsers = await Enroll.find({ course: courseId });
  const users = enrolledUsers.map((enrollment) => enrollment.user);

  res.status(200).json({
    status: 'success',
    usersCount: users.length,
    data: { users },
  });
});

export const getAllEnrollments = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Enroll.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const enrollments = await features.query;
  res.status(200).json({
    status: 'success',
    results: enrollments.length,
    data: {
      enrollments,
    },
  });
});

export const getEnrollment = catchAsync(async (req, res, next) => {
  const enrollment = await Enroll.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!enrollment) {
    return next(new AppError('No enrollment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      enrollment,
    },
  });
});

export const deleteEnrollment = deleteOne(Enroll);

export const getEnrollmentsByUser = catchAsync(async (req, res, next) => {
  const enrollments = await Enroll.findOne({
    user: req.user._id,
    course: req.params.id,
  });
  res.status(200).json({
    status: 'success',
    data: {
      enrollments,
    },
  });
});
//Logic  under review
// export const updateEnrollment = updateOne(Booking);

//TODO

/*
1)Update enrollment
2)Get all enrollments on course
3)Get all enrollments by user
*/
