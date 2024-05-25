import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/userModel.js';
import Course from '../models/coursesModel.js';
import Enroll from '../models/courseEnrollModel.js';
import ApiFeatures from '../utils/apiKeyFeatures.js';
import FinancialAidRequest from '../models/financialAidMode.js';

export const getFinancialAidRequests = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(
    FinancialAidRequest.find({ user: req.user._id }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const financialAidRequests = await features.query;
  res.status(200).json({
    status: 'success',
    results: financialAidRequests.length,
    data: {
      financialAidRequests,
    },
  });
});

export const getFinancialAidRequest = catchAsync(async (req, res, next) => {
  const financialAidRequest = await FinancialAidRequest.findOne({
    user: req.user._id,
    _id: req.params.id,
  });
  if (!financialAidRequest) {
    return next(new AppError('No financialAidRequest found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      financialAidRequest,
    },
  });
});

export const createFinancialAidRequest = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id, active: true });
  const course = await Course.findById(req.body.courseId);
  if (!user || !course) {
    return next(new AppError('User or Course not found', 404));
  }
  const isEnrolled = await Enroll.findOne({
    user: user._id,
    course: course._id,
  });
  const isAlreadyApplied = await FinancialAidRequest.findOne({
    course: course._id,
    user: user._id,
  });

  if (isEnrolled) {
    return next(
      new AppError(
        ' You are already enrolled in this course, you can not apply for financial aid.',
        400,
      ),
    );
  }
  if (isAlreadyApplied) {
    return next(
      new AppError(
        'You have already applied for financial aid for this course, you can not apply again.',
        400,
      ),
    );
  }

  const newFinancialAidRequest = await FinancialAidRequest.create({
    ...req.body,
    user: user._id,
    email: user.email,
    name: user.name,
    course: course._id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newFinancialAidRequest,
    },
  });
});

export const updateFinancialAidRequest = catchAsync(async (req, res, next) => {
  const financialAidRequest = await FinancialAidRequest.findOneAndUpdate(
    { user: req.user._id, _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!financialAidRequest) {
    return next(new AppError('No financialAidRequest found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      financialAidRequest,
    },
  });
});

export const deleteFinancialAidRequest = catchAsync(async (req, res, next) => {
  const financialAidRequest = await FinancialAidRequest.findOneAndDelete({
    user: req.user._id,
    _id: req.params.id,
  });
  if (!financialAidRequest) {
    return next(new AppError('No financialAidRequest found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//admin actions

//approvers financial aid request
export const approveFinancialAidRequest = catchAsync(async (req, res, next) => {
  const financialAidRequest = await FinancialAidRequest.findOneAndUpdate(
    { _id: req.params.id },
    { applicationStatus: 'approved' },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!financialAidRequest) {
    return next(new AppError('No financialAidRequest found with that ID', 404));
  }

  const isAlreadyEnrolled = await Enroll.findOne({
    user: financialAidRequest.user,
    course: financialAidRequest.course,
  });

  if (isAlreadyEnrolled) {
    await FinancialAidRequest.deleteOne({ _id: req.params.id });
    return next(
      new AppError(
        'User is already enrolled in this course, you can not approve financial aid request.',
        400,
      ),
    );
  }

  await Enroll.create({
    user: financialAidRequest.user,
    course: financialAidRequest.course,
    paid: false,
    financialAid: true,
  });
  await FinancialAidRequest.deleteOne({ _id: req.params.id });
  res.status(200).json({
    status: 'success',
    data: {
      financialAidRequest,
    },
  });
});

// reject financial aid request
export const rejectFinancialAidRequest = catchAsync(async (req, res, next) => {
  const financialAidRequest = await FinancialAidRequest.findOneAndUpdate(
    { _id: req.params.id },
    { applicationStatus: 'rejected' },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!financialAidRequest) {
    return next(new AppError('No financialAidRequest found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      financialAidRequest,
    },
  });
});

//get all financial aid requests
export const getAllFinancialAidRequestsAdmin = catchAsync(
  async (req, res, next) => {
    const features = new ApiFeatures(FinancialAidRequest.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const financialAidRequests = await features.query;
    res.status(200).json({
      status: 'success',
      results: financialAidRequests.length,
      data: {
        financialAidRequests,
      },
    });
  },
);

// get financial aid request
export const getFinancialAidRequestAdmin = catchAsync(
  async (req, res, next) => {
    const financialAidRequest = await FinancialAidRequest.findById(
      req.params.id,
    );
    if (!financialAidRequest) {
      return next(
        new AppError('No financialAidRequest found with that ID', 404),
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        financialAidRequest,
      },
    });
  },
);

// delete financial aid request
export const deleteFinancialAidRequestAdmin = catchAsync(
  async (req, res, next) => {
    const financialAidRequest = await FinancialAidRequest.findByIdAndDelete(
      req.params.id,
    );
    if (!financialAidRequest) {
      return next(
        new AppError('No financialAidRequest found with that ID', 404),
      );
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
);
