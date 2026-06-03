export const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = 'Internal server error';

  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Duplicate entry';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired, please login again';
  } else if (err.statusCode) {
    message = err.message;
  } else if (process.env.NODE_ENV !== 'production') {
    message = err.message || message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: process.env.NODE_ENV === 'production' ? null : { stack: err.stack },
  });
};
