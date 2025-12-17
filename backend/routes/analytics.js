const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getStudentAnalytics,
  getTeacherAnalytics,
  getTeacherStudents
} = require('../controllers/analyticsController');

// All routes require authentication
router.use(protect);

// Student analytics
router.get('/student', authorize('student'), getStudentAnalytics);

// Teacher analytics
router.get('/teacher', authorize('teacher', 'admin'), getTeacherAnalytics);
router.get('/teacher/students', authorize('teacher', 'admin'), getTeacherStudents);

module.exports = router;