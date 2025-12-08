const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizResults,
  getCourseQuizzes
} = require('../controllers/quizController');

const router = express.Router();

const quizValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('courseId').notEmpty().withMessage('Course ID is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
];

const submitValidation = [
  body('answers').isObject().withMessage('Answers must be an object')
];

// Public/Protected routes
router.get('/', protect, getAllQuizzes);
router.get('/course/:courseId', protect, getCourseQuizzes);
router.get('/:id', protect, getQuizById);
router.get('/:id/results', protect, getQuizResults);

// Teacher/Admin routes
router.post('/', protect, authorize('teacher', 'admin'), quizValidation, validate, createQuiz);
router.put('/:id', protect, authorize('teacher', 'admin'), updateQuiz);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteQuiz);

// Student routes
router.post('/:id/submit', protect, submitValidation, validate, submitQuiz);

module.exports = router;
