import Task from '../models/taskModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import APIFeatures from '../utils/apiKeyFeatures.js';

export const getAllTasks = catchAsync(async (req, res, next) => {
  // const tasks = await Task.find({ createdBy: req.user._id });
  const features = new APIFeatures(
    Task.find({ createdBy: req.user._id }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tasks = await features.query;

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

export const getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!task) {
    return next(new AppError('No document found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

export const createTask = catchAsync(async (req, res, next) => {
  const taskObj = { ...req.body, createdBy: req.user._id };
  const task = await Task.create(taskObj);
  res.status(201).json({
    status: 'success',
    data: {
      task,
    },
  });
});

export const updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user.id,
    },
    req.body,
    { new: true, runValidators: true },
  );

  if (!updatedTask) {
    return next(new AppError('No document found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      updatedTask,
    },
  });
});

export const deleteTask = catchAsync(async (req, res, next) => {
  const deletedTask = await Task.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.id,
  });
  if (!deletedTask) {
    return next(new AppError('No document found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getTaskStats = catchAsync(async (req, res, next) => {
  const stats = await Task.aggregate([
    {
      $match: { createdBy: req.user._id },
    },
    {
      $group: {
        _id: '$status',
        numTasks: { $sum: 1 },
      },
    },
  ]);

  const tasksLength = await Task.countDocuments({ createdBy: req.user._id });

  res.status(200).json({
    status: 'success',
    data: {
      length: tasksLength,
      stats,
    },
  });
});
