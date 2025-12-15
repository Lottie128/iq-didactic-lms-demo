const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons
} = require('../controllers/lessonController');

const router = express.Router();

const lessonValidation = [
  body('courseId').notEmpty().withMessage('Course ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('videoUrl').optional().trim(),
  body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive number'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive number')
];

// Get all lessons for a course (public if course is public)
router.get('/course/:courseId', getAllLessons);

// Get single lesson by ID
router.get('/:id', getLessonById);

// Protected routes - only teachers and admins can manage lessons
router.post('/', protect, authorize('teacher', 'admin'), lessonValidation, validate, createLesson);
router.put('/:id', protect, authorize('teacher', 'admin'), updateLesson);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteLesson);
router.post('/reorder', protect, authorize('teacher', 'admin'), reorderLessons);

module.exports = router;
