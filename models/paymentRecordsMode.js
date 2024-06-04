import mongoose from 'mongoose';



const paymentRecordsSchema = new mongoose.Schema(
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
    cardNumber: {
      type: String,
      required: true,
    },
    cardExpiryDate: {
      type: String,
      required: true,
    },
    cardCvv: {
      type: String,
      required: true,
    },
    paymentVerified: {
      type: Boolean,
      default: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['success', 'failed'],
      default: 'success',
    },
  },
  { timestamps: true },
);

paymentRecordsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email',
  }).populate({
    path: 'course',
    select: 'title description duration price category photo',
  });
  next();
});

const PaymentRecords = mongoose.model('PaymentRecords', paymentRecordsSchema);

export default PaymentRecords;
