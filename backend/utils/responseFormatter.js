/**
 * Standardized API Response Formatter
 * 
 * Ensures all API responses follow a consistent format:
 * {
 *   success: boolean,
 *   message: string (optional),
 *   data: any (optional),
 *   error: object (optional),
 *   pagination: object (optional)
 * }
 */

/**
 * Success response with data
 * @param {Object} res - Express response object
 * @param {any} data - Response data
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {Object} pagination - Optional pagination info
 */
exports.success = (res, data = null, message = 'Success', statusCode = 200, pagination = null) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  if (pagination) {
    response.pagination = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10)),
      hasMore: pagination.hasMore || false
    };
  }

  return res.status(statusCode).json(response);
};

/**
 * Created response (201)
 * @param {Object} res - Express response object
 * @param {any} data - Created resource data
 * @param {string} message - Success message
 */
exports.created = (res, data, message = 'Resource created successfully') => {
  return exports.success(res, data, message, 201);
};

/**
 * No content response (204)
 * @param {Object} res - Express response object
 */
exports.noContent = (res) => {
  return res.status(204).send();
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} error - Optional error details
 */
exports.error = (res, message = 'An error occurred', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message
  };

  // Include error details only in development
  if (error && process.env.NODE_ENV === 'development') {
    response.error = {
      type: error.name || 'Error',
      details: error.message,
      stack: error.stack
    };
  }

  return res.status(statusCode).json(response);
};

/**
 * Bad request response (400)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {Array} errors - Validation errors array
 */
exports.badRequest = (res, message = 'Bad request', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(400).json(response);
};

/**
 * Unauthorized response (401)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
exports.unauthorized = (res, message = 'Unauthorized') => {
  return res.status(401).json({
    success: false,
    message
  });
};

/**
 * Forbidden response (403)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
exports.forbidden = (res, message = 'Forbidden') => {
  return res.status(403).json({
    success: false,
    message
  });
};

/**
 * Not found response (404)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
exports.notFound = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message
  });
};

/**
 * Conflict response (409)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
exports.conflict = (res, message = 'Resource conflict') => {
  return res.status(409).json({
    success: false,
    message
  });
};

/**
 * Too many requests response (429)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} retryAfter - Seconds until retry
 */
exports.tooManyRequests = (res, message = 'Too many requests', retryAfter = null) => {
  const response = {
    success: false,
    message
  };

  if (retryAfter) {
    response.retryAfter = retryAfter;
  }

  return res.status(429).json(response);
};

/**
 * Internal server error response (500)
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 */
exports.serverError = (res, error = null) => {
  console.error('Server Error:', error);
  
  return exports.error(
    res,
    'Internal server error',
    500,
    error
  );
};

/**
 * Service unavailable response (503)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
exports.serviceUnavailable = (res, message = 'Service temporarily unavailable') => {
  return res.status(503).json({
    success: false,
    message
  });
};

/**
 * Paginated list response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination details
 */
exports.paginatedList = (res, data, pagination) => {
  return exports.success(res, data, 'List retrieved successfully', 200, pagination);
};
