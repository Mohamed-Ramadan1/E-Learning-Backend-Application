import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import User from './../models/userModel.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
// adding logic of clearing the cookie
export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! pleas log in to access', 401),
    );
  }
  const decode = await promisify(jwt.verify)(token, process.env.SECRET);
  const currentUser = await User.findById(decode.id);

  if (!currentUser) {
    return next(
      new AppError('The user that token belong  no longer exist', 401),
    );
  }

  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError('User recently changed password pleas login again', 401),
    );
  }
  //passing the user to req to access it in the restrict middleware
  req.user = currentUser;

  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    //Check if the user have the attributes role
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action ', 403),
      );
    }
    next();
  };
};
