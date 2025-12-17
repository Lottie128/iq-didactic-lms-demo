// In-memory rate limiter (for production, use Redis)
const rateLimit = new Map();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimit.entries()) {
    if (now > data.resetTime) {
      rateLimit.delete(key);
    }
  }
}, 60000); // Clean every minute

/**
 * Create a rate limiter middleware
 * @param {Object} options - Rate limiter options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests per window
 * @param {string} options.message - Error message when limit is exceeded
 * @returns {Function} Express middleware function
 */
exports.createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // 100 requests
    message = 'Too many requests, please try again later.',
    keyGenerator = (req) => {
      // Use IP address as key, but consider user ID if authenticated
      return req.user?.id || req.ip || req.connection.remoteAddress;
    }
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();
    
    let rateLimitData = rateLimit.get(key);
    
    // Initialize or reset if window expired
    if (!rateLimitData || now > rateLimitData.resetTime) {
      rateLimitData = {
        count: 0,
        resetTime: now + windowMs
      };
      rateLimit.set(key, rateLimitData);
    }
    
    // Increment request count
    rateLimitData.count++;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - rateLimitData.count));
    res.setHeader('X-RateLimit-Reset', new Date(rateLimitData.resetTime).toISOString());
    
    // Check if limit exceeded
    if (rateLimitData.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000)
      });
    }
    
    next();
  };
};

/**
 * Strict rate limiter for sensitive endpoints (login, register)
 */
exports.strictRateLimiter = exports.createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests
  message: 'Too many attempts from this IP, please try again after 15 minutes.'
});

/**
 * Standard rate limiter for general API endpoints
 */
exports.standardRateLimiter = exports.createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests
  message: 'Too many requests, please try again later.'
});
