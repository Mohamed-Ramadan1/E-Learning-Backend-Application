import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRouter from './routes/userRoute.js';
import AdminRouter from './routes/adminRoute.js';
import courseRouter from './routes/courseRoute.js';
import enrollmentRouter from './routes/enrollmentRoute.js';
import authRouter from './routes/authRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import taskRouter from './routes/tasksRoute.js';
import blogRouter from './routes/blogRoute.js';
import instructorApplicationsRouter from './routes/InstructorApplicationsRoute.js';
import paymentRecordsRouter from './routes/paymentRecordsRoute.js';
import financialAidRequestRouter from './routes/financialAidRoute.js';
import userCoursesNotesRouter from './routes/userCoursesNotesRoute.js';
import wishlistRouter from './routes/wishlistRoute.js';

import AppError from './utils/appError.js';
import globalError from './controllers/errorController.js';

const app = express();

//middleware for handel CORS errors
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      'https://linfront.onrender.com',
    ],
  }),
);

app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(xss());
app.use(cookieParser());

// Serving static files
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './public')));

app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1500,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', AdminRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/enrolls', enrollmentRouter);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/instructorApplications', instructorApplicationsRouter);
app.use('/api/v1/paymentRecords', paymentRecordsRouter);
app.use('/api/v1/financialAidRequests', financialAidRequestRouter);
app.use('/api/v1/userCoursesNotes', userCoursesNotesRouter);
app.use('/api/v1/wishlist', wishlistRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl}  on this server!`));
});

app.use(globalError);

export default app;
