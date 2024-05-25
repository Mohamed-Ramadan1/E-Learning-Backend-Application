import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    duration: {
      type: Number,
      required: [true, 'Please provide a duration'],
    },
    videos: [
      {
        title: String,
        url: String, // video url
      },
    ],
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      default: 0,
    },
    discount: {
      type: Number,
    },
    financialAid: {
      type: Boolean,
      default: false,
    },
    paymentModel: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free',
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      // set: (val) => Math.round(val * 10),
    },

    instructor: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Instructor',
        required: [true, 'Course must belong to an instructor'],
      },
    ],
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    photo: {
      type: String,
      default:
        'https://res.cloudinary.com/dfjwny742/image/upload/v1715258244/1_u6lrhj.jpg',
    },
    photoPublicId: String,

    learningObjectives: [String],
    skillLevel: String,
    language: String,
    contentFormat: String, // Optional
    completionStatus: String, // Optional, for tracking student progress
    prerequisites: [String], // Optional
    // Optional nested schema for curriculum structure (if needed)
  },
  { timestamps: true },
);
courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'instructor',
    select:
      'name email description phone experience specialization rating courses',
  });
  next();
});
const Course = mongoose.model('Course', courseSchema);

export default Course;
