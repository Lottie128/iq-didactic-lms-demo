const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

/**
 * Auth validation rules
 */
exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
  
  body('role')
    .optional()
    .isIn(['student', 'teacher', 'admin']).withMessage('Invalid role'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)
    .withMessage('Invalid phone number format'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Country name too long'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City name too long'),
  
  handleValidationErrors
];

exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

exports.validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
  
  handleValidationErrors
];

/**
 * Course validation rules
 */
exports.validateCourse = [
  body('title')
    .trim()
    .notEmpty().withMessage('Course title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Course description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Category name too long'),
  
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid course level'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('duration')
    .optional()
    .isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  
  handleValidationErrors
];

/**
 * Lesson validation rules
 */
exports.validateLesson = [
  body('title')
    .trim()
    .notEmpty().withMessage('Lesson title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('Lesson content is required'),
  
  body('courseId')
    .notEmpty().withMessage('Course ID is required')
    .isUUID().withMessage('Invalid course ID format'),
  
  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  
  body('duration')
    .optional()
    .isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  
  handleValidationErrors
];

/**
 * Quiz validation rules
 */
exports.validateQuiz = [
  body('title')
    .trim()
    .notEmpty().withMessage('Quiz title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('courseId')
    .notEmpty().withMessage('Course ID is required')
    .isUUID().withMessage('Invalid course ID format'),
  
  body('questions')
    .isArray({ min: 1 }).withMessage('Quiz must have at least one question'),
  
  body('questions.*.question')
    .trim()
    .notEmpty().withMessage('Question text is required'),
  
  body('questions.*.options')
    .isArray({ min: 2 }).withMessage('Each question must have at least 2 options'),
  
  body('questions.*.correctAnswer')
    .isInt({ min: 0 }).withMessage('Correct answer index is required'),
  
  body('passingScore')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Passing score must be between 0 and 100'),
  
  handleValidationErrors
];

/**
 * Review validation rules
 */
exports.validateReview = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .trim()
    .notEmpty().withMessage('Review comment is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  
  handleValidationErrors
];

/**
 * Discussion validation rules
 */
exports.validateDiscussion = [
  body('title')
    .trim()
    .notEmpty().withMessage('Discussion title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('Discussion content is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Content must be between 10 and 5000 characters'),
  
  body('courseId')
    .notEmpty().withMessage('Course ID is required')
    .isUUID().withMessage('Invalid course ID format'),
  
  handleValidationErrors
];

exports.validateComment = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 2000 }).withMessage('Comment must be between 1 and 2000 characters'),
  
  body('parentId')
    .optional()
    .isUUID().withMessage('Invalid parent comment ID format'),
  
  handleValidationErrors
];

/**
 * ID parameter validation
 */
exports.validateId = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isUUID().withMessage('Invalid ID format'),
  
  handleValidationErrors
];

/**
 * Pagination validation
 */
exports.validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

/**
 * User profile update validation
 */
exports.validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)
    .withMessage('Invalid phone number format'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Country name too long'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City name too long'),
  
  handleValidationErrors
];
