import catchAsync from '../utils/catchAsync.js';
import Instructor from '../models/InstructorModel.js';

import APIFeatures from '../utils/apiKeyFeatures.js';

import AppError from '../utils/appError.js';

export const getAllInstructors = catchAsync(async (req, res, next) => {
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

export const updateInstructor = catchAsync(async (req, res, next) => {
  const instructor = await Instructor.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
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
