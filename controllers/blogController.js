import catchAsync from '../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import APIFeatures from './../utils/apiKeyFeatures.js';
import Blog from '../models/blogModel.js';

export const getAllBlogs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Blog.find({ visibility: 'public', published: true }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const blogs = await features.query;

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

export const getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new AppError('No document found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

export const createBlog = catchAsync(async (req, res, next) => {
  const blogObj = { ...req.body, createdBy: req.user._id };
  console.log(blogObj);
  const blog = await Blog.create(blogObj);
  res.status(201).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

export const updateBlog = catchAsync(async (req, res, next) => {
  const updatedBlog = await Blog.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user._id,
    },
    req.body,
    { new: true, runValidators: true },
  );
  res.status(200).json({
    status: 'success',
    data: {
      updatedBlog,
    },
  });
});

export const deleteBlog = catchAsync(async (req, res, next) => {
  await Blog.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.id,
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getMyBlogs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Blog.find({ createdBy: req.user.id }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const blogs = await features.query;
  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});
