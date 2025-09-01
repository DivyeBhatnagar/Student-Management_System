const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        message = 'Duplicate entry. This record already exists.';
        statusCode = 400;
        break;
      case '23503': // Foreign key violation
        message = 'Referenced record does not exist.';
        statusCode = 400;
        break;
      case '23502': // Not null violation
        message = 'Required field is missing.';
        statusCode = 400;
        break;
      case '23514': // Check constraint violation
        message = 'Invalid data format or value.';
        statusCode = 400;
        break;
      case '42P01': // Undefined table
        message = 'Database table not found.';
        statusCode = 500;
        break;
      case '42703': // Undefined column
        message = 'Database column not found.';
        statusCode = 500;
        break;
      case 'ECONNREFUSED':
        message = 'Database connection refused.';
        statusCode = 500;
        break;
      default:
        if (err.code.startsWith('23')) {
          message = 'Data constraint violation.';
          statusCode = 400;
        }
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    statusCode = 400;
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File size too large';
    statusCode = 400;
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    message = 'Too many files';
    statusCode = 400;
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    message = 'Unexpected file field';
    statusCode = 400;
  }

  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
    console.error('Error Details:', {
      name: err.name,
      code: err.code,
      message: err.message,
      statusCode
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: {
        name: err.name,
        code: err.code,
        originalMessage: err.message
      }
    })
  });
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  notFound,
  errorHandler,
  asyncHandler,
  CustomError
};
