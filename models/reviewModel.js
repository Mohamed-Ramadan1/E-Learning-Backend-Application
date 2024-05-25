import mongoose from 'mongoose';
import Course from './coursesModel.js';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review  must have a text'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    course: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Review must belong  to a tour'],
      },
    ],

    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong  to a user  '],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'course',
    select: 'title description instructor',
  }).populate({ path: 'user', select: 'name email' });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (courseId) {
  // console.log(courseId, 'courseId');
  const stats = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: '$course',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      totalReviews: stats[0].nRating,
      averageRating: stats[0].avgRating,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      totalReviews: 0,
      averageRating: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.course);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.course);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
