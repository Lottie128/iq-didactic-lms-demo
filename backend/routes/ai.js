const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  generateQuiz,
  generateContent,
  generateOutline,
  chat,
  getRecommendations,
  getStudyTips
} = require('../controllers/aiController');

// All routes require authentication
router.use(protect);

// POST /api/ai/generate-quiz - Generate quiz questions (Teacher/Admin only)
router.post('/generate-quiz', authorize('teacher', 'admin'), generateQuiz);

// POST /api/ai/generate-content - Generate lesson content (Teacher/Admin only)
router.post('/generate-content', authorize('teacher', 'admin'), generateContent);

// POST /api/ai/generate-outline - Generate course outline (Teacher/Admin only)
router.post('/generate-outline', authorize('teacher', 'admin'), generateOutline);

// POST /api/ai/chat - Chat with AI teacher (All authenticated users)
router.post('/chat', chat);

// GET /api/ai/recommendations - Get personalized course recommendations (All authenticated users)
router.get('/recommendations', getRecommendations);

// GET /api/ai/study-tips - Get personalized study tips (All authenticated users)
router.get('/study-tips', getStudyTips);

module.exports = router;