const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  getPendingTeachers,
  verifyTeacher,
  rejectTeacher,
  updateUser,
  deleteUser,
  getAllCourses
} = require('../controllers/adminController');

// All admin routes require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard & Analytics
router.get('/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Teacher Verification
router.get('/teachers/pending', getPendingTeachers);
router.put('/teachers/:id/verify', verifyTeacher);
router.delete('/teachers/:id/reject', rejectTeacher);

// Course Management
router.get('/courses', getAllCourses);

module.exports = router;