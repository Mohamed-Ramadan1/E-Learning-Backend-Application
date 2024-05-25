import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    description: {
      type: String,
      required: [true, 'Please provide your description'],
    },
    specialization: {
      type: String,
      required: [true, 'Please provide your specialization'],
    },
    courses: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
      },
    ],
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive'],
    },
    experience: {
      type: Number,
      required: [true, 'Please provide your experience'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Instructor = mongoose.model('Instructor', instructorSchema);

export default Instructor;
