import User from '../models/userModel.js';
import Tasks from '../models/taskModel.js';
import Enroll from '../models/courseEnrollModel.js';
import Blog from '../models/blogModel.js';
import Review from '../models/reviewModel.js';
import FinancialAidRequests from '../models/financialAidMode.js';
import UserCoursesNotes from '../models/userCoursesNotesModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiKeyFeatures.js';
import cloudinary from 'cloudinary';
import { promises as fs } from 'fs';
import jwt from 'jsonwebtoken';
import { getOne, createOne, updateOne } from './factoryHandler.js';

import { createSendToken } from '../utils/tokenUtil.js';

//filter object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

export const updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;
  if (!passwordCurrent || !password || !passwordConfirm) {
    return next(
      new AppError(
        'please provide current Password , password , confirm password',
        400,
      ),
    );
  }

  const user = await User.findById(req.user._id).select('+password');
  const isValidPassword = await user.correctPassword(
    passwordCurrent,
    user.password,
  );

  if (!user || !isValidPassword) {
    return next(new AppError('un authorized user', 401));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

export const updateUserData = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'You cant use this route to update password use `api/v1/users/updatePassword`',
        400,
      ),
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  // console.log('filteredBody', filteredBody);
  // console.log('ffff', req.file);
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    filteredBody.photo = response.secure_url;
    filteredBody.photoPublicId = response.public_id;
  }
  console.log(filteredBody);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    // runValidators: true,
  });

  // if (req.file && updatedUser.photoPublicId) {
  //   await cloudinary.v2.uploader.destroy(updatedUser.photoPublicId);
  // }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMyAccount = catchAsync(async (req, res, next) => {
  // 1) UnActivate the user
  await User.findByIdAndDelete(req.user._id);
  await Enroll.deleteMany({ user: req.user._id });
  await Review.deleteMany({ user: req.user._id });
  await Tasks.deleteMany({ createdBy: req.user._id });
  await Blog.deleteMany({ createdBy: req.user._id });
  await FinancialAidRequests.deleteMany({ user: req.user._id });
  await UserCoursesNotes.deleteMany({ user: req.params.id });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const unActivateMe = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { active: false },
    { new: true },
  );
  const token = jwt.sign({ id: req.user._id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN_LOGOUT,
  });

  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({ msg: 'account un Activate successfully', token });
});

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user || user.active === false) {
    return next(new AppError('You not logged in', 401));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const getMyCourses = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Enroll.find({ user: req.user._id }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const enroll = await features.query;

  const courses = enroll.map((el) => el.course);
  res.status(200).json({
    status: 'success',
    data: {
      courses,
    },
  });
});

export const getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user._id });
  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});

export const getMyTasks = catchAsync(async (req, res, next) => {
  const tasks = await Tasks.find({ createdBy: req.user._id });
  res.status(200).json({
    status: 'success',
    data: {
      tasks,
    },
  });
});
