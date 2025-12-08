const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getProgress,
  updateProgress,
  markLessonComplete,
  getCourseProgress
} = require('../controllers/progressController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/:courseId', getCourseProgress);
router.get('/lesson/:lessonId', getProgress);
router.put('/lesson/:lessonId', updateProgress);
router.post('/lesson/:lessonId/complete', markLessonComplete);

module.exports = router;
