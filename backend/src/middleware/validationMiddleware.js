const { validationResult } = require('express-validator');
const { CustomError } = require('./errorMiddleware');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    throw new CustomError(`Validation failed: ${errorMessages.map(e => e.message).join(', ')}`, 400);
  }
  
  next();
};

// Common validation helpers
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (isNaN(pageNum) || pageNum < 1) {
    throw new CustomError('Page must be a positive integer', 400);
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new CustomError('Limit must be between 1 and 100', 400);
  }
  
  req.pagination = {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum
  };
  
  next();
};

const validateSortOrder = (req, res, next) => {
  const { sortBy, sortOrder = 'asc' } = req.query;
  
  if (sortOrder && !['asc', 'desc'].includes(sortOrder.toLowerCase())) {
    throw new CustomError('Sort order must be either "asc" or "desc"', 400);
  }
  
  req.sort = {
    sortBy,
    sortOrder: sortOrder.toLowerCase()
  };
  
  next();
};

const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  if (startDate && !Date.parse(startDate)) {
    throw new CustomError('Invalid start date format', 400);
  }
  
  if (endDate && !Date.parse(endDate)) {
    throw new CustomError('Invalid end date format', 400);
  }
  
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    throw new CustomError('Start date cannot be after end date', 400);
  }
  
  req.dateRange = {
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null
  };
  
  next();
};

const validateFileUpload = (allowedTypes = [], maxSize = 5242880) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }
    
    const files = req.files || [req.file];
    
    for (const file of files) {
      if (file.size > maxSize) {
        throw new CustomError(`File ${file.originalname} is too large. Maximum size is ${maxSize} bytes`, 400);
      }
      
      if (allowedTypes.length > 0) {
        const fileType = file.mimetype.split('/')[1];
        if (!allowedTypes.includes(fileType)) {
          throw new CustomError(`File type ${fileType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`, 400);
        }
      }
    }
    
    next();
  };
};

module.exports = {
  validate,
  validatePagination,
  validateSortOrder,
  validateDateRange,
  validateFileUpload
};
