import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiKeyFeatures.js';
import InstructorApplication from '../models/instractorApplicationsModel.js';
import Instructor from '../models/InstructorModel.js';

export const createInstructorApplication = catchAsync(
  async (req, res, next) => {
    // check if the user is already an instructor or have an application
    const instructor = await Instructor.findOne({ email: req.body.email });
    const hasApplication = await InstructorApplication.findOne({
      email: req.body.email,
    });

    if (instructor) {
      return next(new AppError('You are already an instructor', 400));
    }
    if (hasApplication) {
      return next(
        new AppError(
          'You have already applied please wait for your application reviewed or contact support ',
          400,
        ),
      );
    }

    const application = await InstructorApplication.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        application,
      },
    });
  },
);

export const getInstructorApplications = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(InstructorApplication.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const applications = await features.query;

  res.status(200).json({
    status: 'success',
    results: applications.length,
    data: {
      applications,
    },
  });
});

export const getInstructorApplication = catchAsync(async (req, res, next) => {
  const application = await InstructorApplication.findById(req.params.id);
  if (!application) {
    return next(new AppError('No application found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      application,
    },
  });
});

export const updateInstructorApplication = catchAsync(
  async (req, res, next) => {
    const application = await InstructorApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!application) {
      return next(new AppError('No application found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        application,
      },
    });
  },
);

export const deleteInstructorApplication = catchAsync(
  async (req, res, next) => {
    const application = await InstructorApplication.findByIdAndDelete(
      req.params.id,
    );
    // if (!application) {
    //   return next(new AppError('No application found with that ID', 404));
    // }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
);

export const approveInstructorApplication = catchAsync(
  async (req, res, next) => {
    const application = await InstructorApplication.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!application) {
      return next(new AppError('No application found with that ID', 404));
    }
    await Instructor.create({
      name: application.name,
      email: application.email,
      description: application.description,
      experience: application.experience,
      experience: application.experience,
      specialization: application.specialization,
    });
    await InstructorApplication.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        application,
      },
    });
  },
);

export const rejectInstructorApplication = catchAsync(
  async (req, res, next) => {
    const application = await InstructorApplication.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!application) {
      return next(new AppError('No application found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        application,
      },
    });
  },
);
