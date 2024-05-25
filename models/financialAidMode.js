import mongoose from 'mongoose';
const financialAidSchema = new mongoose.Schema(
  {
    age: {
      type: Number,
      required: [true, 'Please provide a age'],
    },
    education: {
      type: String,
      enum: ['high school', 'bachelor', 'master', 'phd', 'other'],
      required: [true, 'Please provide a education'],
    },
    employmentStatus: {
      type: String,
      enum: ['fullTime', 'partTime', 'unemployed', 'student', 'other'],
      required: [true, 'Please provide a employmentStatus'],
    },
    applymentReason: {
      type: String,
      required: [true, 'Please provide a applymentResone'],
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },

    applicationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//add populate for course and user on every find Query
financialAidSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'course',
    select: 'title description instructor',
  }).populate({ path: 'user', select: 'name email' });
  next();
});

const FinancialAidRequests = mongoose.model(
  'FinancialAidApplications',
  financialAidSchema,
);

export default FinancialAidRequests;
