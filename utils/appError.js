class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // getting the place  where the error happened
    Error.captureStackTrace(this, this.constructor);
  }
}
export default AppError;
