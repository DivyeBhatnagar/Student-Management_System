const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { asyncHandler, CustomError } = require('./errorMiddleware');

// Protect routes - check if user is authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const result = await query(
        'SELECT id, email, role, first_name, last_name, is_active FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length === 0) {
        throw new CustomError('User not found', 401);
      }

      const user = result.rows[0];

      if (!user.is_active) {
        throw new CustomError('User account is deactivated', 401);
      }

      // Set user in request object
      req.user = user;

      // Update last login
      await query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new CustomError('Invalid token', 401);
      }
      if (error.name === 'TokenExpiredError') {
        throw new CustomError('Token expired', 401);
      }
      throw error;
    }
  }

  if (!token) {
    throw new CustomError('Not authorized, no token', 401);
  }
});

// Admin access
const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    throw new CustomError('Not authorized as admin', 403);
  }
});

// Super admin access
const superAdminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    throw new CustomError('Not authorized as super admin', 403);
  }
});

// Faculty access
const facultyOnly = asyncHandler(async (req, res, next) => {
  if (
    req.user && 
    ['faculty', 'admin', 'super_admin'].includes(req.user.role)
  ) {
    next();
  } else {
    throw new CustomError('Not authorized as faculty', 403);
  }
});

// Student access
const studentOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    throw new CustomError('Not authorized as student', 403);
  }
});

// Multiple roles access
const authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new CustomError('Not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new CustomError(
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }

    next();
  });
};

// Check if user owns the resource or is admin
const ownershipOrAdmin = (resourceIdParam = 'id', userIdField = 'user_id') => {
  return asyncHandler(async (req, res, next) => {
    // Admins can access any resource
    if (['admin', 'super_admin'].includes(req.user.role)) {
      return next();
    }

    // For students, check ownership
    const resourceId = req.params[resourceIdParam];
    
    // If checking user's own profile
    if (resourceIdParam === 'id' && resourceId === req.user.id) {
      return next();
    }

    // For other resources, would need to query the database to check ownership
    // This is a placeholder - implement based on specific resource type
    throw new CustomError('Not authorized to access this resource', 403);
  });
};

// Rate limiting per user
const userRateLimit = asyncHandler(async (req, res, next) => {
  // Implement user-specific rate limiting if needed
  // This could be based on user role, subscription level, etc.
  next();
});

// Audit log middleware
const auditLog = (action) => {
  return asyncHandler(async (req, res, next) => {
    // Store original res.json
    const originalJson = res.json;

    // Override res.json to capture response
    res.json = function(data) {
      // Log the action
      if (req.user) {
        query(
          `INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values, ip_address, user_agent) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            req.user.id,
            action,
            req.route?.path || req.originalUrl,
            req.params?.id || null,
            JSON.stringify(req.body),
            req.ip,
            req.get('user-agent')
          ]
        ).catch(err => console.error('Audit log error:', err));
      }

      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  });
};

module.exports = {
  protect,
  adminOnly,
  superAdminOnly,
  facultyOnly,
  studentOnly,
  authorize,
  ownershipOrAdmin,
  userRateLimit,
  auditLog
};
