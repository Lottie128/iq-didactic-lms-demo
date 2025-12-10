const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Mock achievements data
const achievements = [
  { id: 1, name: 'First Steps', description: 'Complete your first lesson', rarity: 'common', xpReward: 10 },
  { id: 2, name: 'Getting Started', description: 'Enroll in your first course', rarity: 'common', xpReward: 25 },
  { id: 3, name: 'Dedicated Learner', description: 'Complete 5 courses', rarity: 'rare', xpReward: 100 },
  { id: 4, name: 'Week Warrior', description: 'Maintain a 7-day streak', rarity: 'rare', xpReward: 75 },
  { id: 5, name: 'Quiz Master', description: 'Score 100% on 10 quizzes', rarity: 'epic', xpReward: 200 },
  { id: 6, name: 'Discussion Hero', description: 'Post 50 discussion replies', rarity: 'epic', xpReward: 150 },
  { id: 7, name: 'Course Creator', description: 'Create your first course', rarity: 'rare', xpReward: 100 },
  { id: 8, name: 'Knowledge Seeker', description: 'Complete 20 courses', rarity: 'legendary', xpReward: 500 }
];

// @route   GET /api/achievements
// @desc    Get all achievements
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/achievements/user
// @desc    Get user's unlocked achievements
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    // Mock user achievements
    const userAchievements = [
      { achievementId: 1, unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { achievementId: 2, unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
    ];
    
    res.json({
      success: true,
      data: userAchievements
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/achievements/check
// @desc    Check for new achievements
// @access  Private
router.post('/check', protect, async (req, res) => {
  try {
    // Logic to check if user unlocked any new achievements
    res.json({
      success: true,
      message: 'Achievements checked',
      newAchievements: []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
