const express = require('express');
const router = express.Router();
const {
  getUserSchedules,
  getSchedulesByMonth,
  getCourseSchedules,
  getUpcomingSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByDateRange
} = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// GET routes
router.get('/', getUserSchedules); // Get all schedules for logged-in user
router.get('/upcoming', getUpcomingSchedules); // Get upcoming schedules (next 7 days)
router.get('/month/:year/:month', getSchedulesByMonth); // Get schedules by month
router.get('/date-range', getSchedulesByDateRange); // Get schedules by date range
router.get('/course/:courseId', getCourseSchedules); // Get schedules for a specific course
router.get('/:id', getScheduleById); // Get single schedule by ID

// POST routes (teachers and admins only)
router.post('/', createSchedule); // Create new schedule

// PUT routes (teachers and admins only)
router.put('/:id', updateSchedule); // Update schedule

// DELETE routes (teachers and admins only)
router.delete('/:id', deleteSchedule); // Delete schedule

module.exports = router;