import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import User from '../models/userModel';

// export const ifUserExist = catchAsync(async (req, res, next) => {
//   const user = await User.findOne({ _id: req.params.id, active: true });
//   if (!user) {
//     res.status(401).json({ message: 'User not found' });
//   }
//   next();
// });
