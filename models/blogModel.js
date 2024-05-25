import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A blog must have a title'],
    },
    content: {
      type: String,
      required: [true, 'A blog must have a content'],
    },
    photo: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'A blog must have a category'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A blog must have a creator'],
    },
    published: {
      type: Boolean,
      default: true,
    },
    // private of public
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: 'name email',
  });
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
