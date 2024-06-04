import User from './../models/userModel.js';
import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import { createSendToken } from '../utils/tokenUtil.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendVerificationMail from '../utils/sendVerificationMail.js';
import sendResetPasswordEmail from '../utils/sendRessetPasswordEmail.js';

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    emailToken: crypto.randomBytes(64).toString('hex'),
  });

  sendVerificationMail(newUser);

  createSendToken(newUser, 201, res);
});


export const verifyEmail = catchAsync(async (req, res, next) => {
  const emailToken = req.params.emailToken;
  console.log(emailToken);
  if (!emailToken) {
    return next(new AppError('please provide  the token', 404));
  }

  const user = await User.findOne({ emailToken });
  console.log(user);
  if (!user) {
    return next(new AppError('No  user exist with that email token', 404));
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    {
      emailToken: null,
      isVerified: true,
      $unset: { passwordConfirm: 1 }, // Remove the passwordConfirm field
    },
    {
      new: true,
    },
  );

  createSendToken(updatedUser, 200, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email or password in correct', 401));
  }

  if (user.active === false) {
    return next(
      new AppError(
        'Your account has been unActivated please tray late or contact support',
        400,
      ),
    );
  }

  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res, next) => {
  const token = jwt.sign({ id: req.user._id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN_LOGOUT,
  });

  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({ msg: 'User logged out!', token });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError('Please provide you email', 404));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('No user exist with this email', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  sendResetPasswordEmail(user);

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = req.params.token;
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});
