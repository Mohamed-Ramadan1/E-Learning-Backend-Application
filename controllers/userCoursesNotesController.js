import User from '../models/userModel.js';
import Enroll from '../models/courseEnrollModel.js';
import UserCoursesNotes from '../models/userCoursesNotesModel.js';
import catchAsync from '../utils/catchAsync.js';
import Course from '../models/coursesModel.js';
import APIFeatures from '../utils/apiKeyFeatures.js';
import AppError from '../utils/appError.js';

export const getAllUsersNotes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    UserCoursesNotes.find({ user: req.user._id }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const usersNotes = await features.query;

  res.status(200).json({
    status: 'success',
    results: usersNotes.length,
    data: {
      usersNotes,
    },
  });
});

export const getUserNote = catchAsync(async (req, res, next) => {
  const userNote = await UserCoursesNotes.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!userNote) {
    return next(
      new AppError(`No document found with the id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      userNote,
    },
  });
});

export const createUserNote = catchAsync(async (req, res, next) => {
  // check if the course exists
  // check if the user is enrolled in the course
  // check if the user is the owner of the course
  const course = await Course.findById(req.body.course);
  const enroll = await Enroll.findOne({
    user: req.user._id,
    course: course._id,
  });
  if (!course || !enroll) {
    return next(
      new AppError('Invalid data  please provide all required data', 400),
    );
  }
  const userNote = await UserCoursesNotes.create({
    ...req.body,
    user: req.user._id,
    course: course._id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      userNote,
    },
  });
});

export const updateUserNote = catchAsync(async (req, res, next) => {
  const userNote = await UserCoursesNotes.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!userNote) {
    return next(new AppError(`No document found with that id `, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      userNote,
    },
  });
});

export const deleteUserNote = catchAsync(async (req, res, next) => {
  const userNote = await UserCoursesNotes.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!userNote) {
    return next(new AppError(`No document found with that id `, 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
