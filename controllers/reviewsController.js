import Review from './../models/reviewModel.js';
import Course from '../models/coursesModel.js';
import Enroll from '../models/courseEnrollModel.js';
import User from '../models/userModel.js';
import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import APIFeatures from '../utils/apiKeyFeatures.js';

import { getOne, updateOne, getAll } from './factoryHandler.js';

export const createReview = catchAsync(async (req, res, next) => {
  const { course: courseId, review, rating } = req.body;
  const userId = req.body.user || req.user._id;

  const course = await Course.findById(courseId);
  const user = await User.findById(userId);

  if (!course || !user || !review) {
    // console.log(course);
    return next(
      new AppError('Invalid data  please provide all required data', 400),
    );
  }
  const isEnrolled = await Enroll.findOne({ course: courseId, user: userId });
  if (!isEnrolled) {
    return next(
      new AppError('You can only review a course you have enrolled in', 400),
    );
  }

  const reviewObj = {
    review,
    rating: rating || 1,
    course,
    user,
  };
  const newReview = await Review.create(reviewObj);

  res.status(201).json({ status: 'success', data: { newReview } });
});

export const getCourseReviews = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  if (!courseId) {
    return next(new AppError('Please provide course id', 400));
  }
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError('No course found with that id ', 404));
  }

  const features = new APIFeatures(Review.find({ course: courseId }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviewsOnCourse = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      reviews: reviewsOnCourse,
    },
  });
});

export const getAllReviews = getAll(Review);
export const getReview = getOne(Review);
export const updateReview = updateOne(Review);

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review found with that id', 404));
  }
  if (review.user[0]._id.toString() !== req.user._id.toString()) {
    return next(new AppError('You are not allowed to delete this review', 400));
  }
  await review.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
