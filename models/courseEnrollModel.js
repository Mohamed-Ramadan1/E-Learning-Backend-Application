import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Booking must belong to a Course!'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a User!'],
    },
    price: {
      type: Number,
      require: [true, 'Booking must have a price.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paid: {
      type: Boolean,
      default: true,
    },
    financialAid: {
      type: Boolean,
      default: false,
    },
    enrollmentStatus: {
      type: String,
      enum: ['approved', 'cancelled'],
      default: 'approved',
    },
  },
  { timestamps: true },
);

enrollmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email',
  }).populate({
    path: 'course',
    select: 'title description duration price category photo',
  });
  next();
});

const Enroll = mongoose.model('Enroll', enrollmentSchema);

export default Enroll;
