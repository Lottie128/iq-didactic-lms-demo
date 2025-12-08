const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getCourseReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful
} = require('../controllers/reviewController');

const router = express.Router();

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
];

// Public routes
router.get('/course/:courseId', getCourseReviews);

// Protected routes
router.post('/course/:courseId', protect, reviewValidation, validate, createReview);
router.put('/:id', protect, reviewValidation, validate, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markHelpful);

module.exports = router;
