import mongoose from 'mongoose';
import validator from 'validator';

const instructorApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },

    experience: {
      type: Number,
      required: [true, 'Please provide an experience'],
    },
    specialization: {
      type: String,
      required: [true, 'Please provide a specialization'],
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const InstructorApplication = mongoose.model(
  'InstructorApplication',
  instructorApplicationSchema,
);

export default InstructorApplication;
