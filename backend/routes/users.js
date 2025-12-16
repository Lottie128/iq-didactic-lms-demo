const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

const router = express.Router();

const profileValidation = [
  body('name').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('country').optional().trim(),
  body('city').optional().trim(),
  body('bio').optional().trim()
];

// Protected routes
// Allow both admin and teacher to view users
router.get('/', protect, authorize('admin', 'teacher'), getAllUsers);
router.get('/stats', protect, getUserStats);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, profileValidation, validate, updateProfile);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
