import catchAsync from '../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import APIFeatures from './../utils/apiKeyFeatures.js';
import PaymentRecord from '../models/paymentRecordsMode.js';
import Wishlist from '../models/wishlistModel.js';
import Enroll from '../models/courseEnrollModel.js';
import Course from '../models/coursesModel.js';

export const getAllPaymentRecords = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(PaymentRecord.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const paymentRecords = await features.query;

  res.status(200).json({
    status: 'success',
    results: paymentRecords.length,
    data: {
      paymentRecords,
    },
  });
});

export const getPaymentRecord = catchAsync(async (req, res, next) => {
  const paymentRecord = await PaymentRecord.findById(req.params.id);
  if (!paymentRecord) {
    return next(new AppError('No document found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      paymentRecord,
    },
  });
});

export const createPaymentRecord = catchAsync(async (req, res, next) => {
  //check if the course exist
  const course = await Course.findById(req.body.course);
  if (!course) {
    return next(new AppError('No course found with that ID', 404));
  }
  const newPaymentRecord = await PaymentRecord.create({
    user: req.user._id,
    course: req.body.course,
    name: req.user.name,
    email: req.user.email,
    cardNumber: req.body.cardNumber,
    cardExpiryDate: req.body.cardExpiryDate,
    cardCvv: req.body.cardCvv,
    paymentAmount: req.body.paymentAmount,
  });
  if (!newPaymentRecord) {
    return next(
      new AppError('Invalid data  please provide all required data', 400),
    );
  }
  const previousEnrollments = await Enroll.findOne({
    course,
    user: req.user._id,
  });
  if (previousEnrollments) {
    return next(new AppError('User already enroll on this course', 400));
  }

  await Enroll.create({ course: req.body.course, user: req.user._id });
  // after creating the payment record check if the user has this course in his wishlist and remove it
  await Wishlist.findOneAndDelete({
    user: req.user._id,
    course: req.body.course,
  });

  res.status(201).json({
    status: 'success',
    data: {
      paymentRecord: newPaymentRecord,
    },
  });
});

export const updatePaymentRecord = catchAsync(async (req, res, next) => {
  const paymentRecord = await PaymentRecord.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!paymentRecord) {
    return next(new AppError('No document found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      paymentRecord,
    },
  });
});

export const deletePaymentRecord = catchAsync(async (req, res, next) => {
  const paymentRecord = await PaymentRecord.findByIdAndDelete(req.params.id);
  if (!paymentRecord) {
    return next(new AppError('No document found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
