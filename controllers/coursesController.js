import Course from '../models/coursesModel.js';
import Enroll from '../models/courseEnrollModel.js';
import Review from '../models/reviewModel.js';
import FinancialAidRequests from '../models/financialAidMode.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import cloudinary from 'cloudinary';
import APIFeatures from '../utils/apiKeyFeatures.js';
import { promises as fs } from 'fs';

export const createCourse = catchAsync(async (req, res, next) => {
  const UpdatedReq = { ...req.body };
  console.log('file', req.file);
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    UpdatedReq.photo = response.secure_url;
    UpdatedReq.photoPublicId = response.public_id;
  }

  const course = await Course.create(UpdatedReq);

  console.log(course);
  res.status(201).json({
    status: 'success',
    data: {
      course,
    },
  });
});

export const getAllCourses = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Course.find(), req.query)
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

export const getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  const enrollments = await Enroll.countDocuments({ course: req.params.id });
  if (!course) {
    return next(new AppError('No course found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      course,
      enrollments,
    },
  });
});

export const updateCourse = catchAsync(async (req, res, next) => {
  const UpdatedReq = { ...req.body };
  console.log('file', req.file);
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    UpdatedReq.photo = response.secure_url;
    UpdatedReq.photoPublicId = response.public_id;
  }
  const course = await Course.findByIdAndUpdate(req.params.id, UpdatedReq, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return next(new AppError('No course found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
});

export const deleteCourse = catchAsync(async (req, res, next) => {
  await Course.findByIdAndDelete(req.params.id);
  await Enroll.deleteMany({ course: req.params.id });
  await Review.deleteMany({ course: req.params.id });
  await FinancialAidRequests.deleteMany({ course: req.params.id });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

