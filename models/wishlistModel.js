import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a User!'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Booking must belong to a Course!'],
    },
  },
  {
    timestamps: true,
  },
);

wishlistSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'course',
    select:
      'title description duration price category photo totalReviews averageRating language paymentModel ',
  });
  next();
});

const Wishlist = mongoose.model('wishlist', wishlistSchema);

export default Wishlist;
