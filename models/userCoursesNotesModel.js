import mongoose from 'mongoose';

const userCoursesNotesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User must belong to a User!'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'User must belong to a Course!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

userCoursesNotesSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'course',
    select: 'title description instructor',
  }).populate({ path: 'user', select: 'name email' });
  next();
});

const UserCoursesNotes = mongoose.model(
  'UserCoursesNotes',
  userCoursesNotesSchema,
);

export default UserCoursesNotes;
