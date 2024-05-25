import Enroll from '../models/courseEnrollModel.js';
import Wishlist from '../models/wishlistModel.js';
import catchAsync from '../utils/catchAsync.js';
import Course from '../models/coursesModel.js';
import APIFeatures from '../utils/apiKeyFeatures.js';
import AppError from '../utils/appError.js';

export const getAllWishlistItems = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Wishlist.find({ user: req.user._id }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const wishlistItems = await features.query;
  res.status(200).json({
    status: 'success',
    results: wishlistItems.length,
    data: {
      wishlistItems,
    },
  });
});

export const getWishlistItem = catchAsync(async (req, res, next) => {
  const wishlistItem = await Wishlist.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!wishlistItem) {
    return next(
      new AppError(
        `No Wishlist Item found with the id of ${req.params.id}`,
        404,
      ),
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: wishlistItem,
    },
  });
});

export const createWishlistItem = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.body.course);
  const enroll = await Enroll.findOne({
    user: req.user._id,
    course: course._id,
  });
  if (enroll) {
    return next(new AppError('You have already enrolled in this course', 400));
  }

  // check if the course in the which list of the user
  const wishlistItemExist = await Wishlist.findOne({
    user: req.user._id,
    course: course._id,
  });
  if (wishlistItemExist) {
    return next(
      new AppError('You have already added this course to your wishlist', 400),
    );
  }

  const wishlistItem = await Wishlist.create({
    user: req.user._id,
    course: course._id,
  });
  res.status(201).json({
    status: 'success',
    data: {
      data: wishlistItem,
    },
  });
});

export const deleteWishlistItem = catchAsync(async (req, res, next) => {
  const wishlistItem = await Wishlist.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!wishlistItem) {
    return next(
      new AppError(
        `No Wishlist Item found with the id of ${req.params.id}`,
        404,
      ),
    );
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const checkCourseInWishlist = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.body.courseId);
  if (!course) {
    return next(new AppError('No course found with that id', 404));
  }
  const wishlistItem = await Wishlist.findOne({
    user: req.user._id,
    course: course._id,
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: !!wishlistItem,
    },
  });
});

export const removeItemFromWishlist = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new AppError('No course found with that id', 404));
  }
  const wishlistItem = await Wishlist.findOneAndDelete({
    user: req.user._id,
    course: course._id,
  });
  if (!wishlistItem) {
    return next(new AppError('No wishlist item found with that id', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
