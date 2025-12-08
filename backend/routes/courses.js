const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  getMyCourses
} = require('../controllers/courseController');

const router = express.Router();

const courseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced'])
];

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/', protect, authorize('teacher', 'admin'), courseValidation, validate, createCourse);
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);

// Enrollment routes
router.post('/:id/enroll', protect, enrollCourse);
router.get('/enrolled/my-courses', protect, getEnrolledCourses);
router.get('/instructor/my-courses', protect, authorize('teacher', 'admin'), getMyCourses);

module.exports = router;
