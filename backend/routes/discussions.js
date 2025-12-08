const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getDiscussions,
  getDiscussionById,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  upvoteDiscussion,
  createComment,
  updateComment,
  deleteComment,
  upvoteComment,
  markBestAnswer
} = require('../controllers/discussionController');

const router = express.Router();

const discussionValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
];

const commentValidation = [
  body('content').trim().notEmpty().withMessage('Content is required')
];

// Discussion routes
router.get('/course/:courseId', protect, getDiscussions);
router.get('/:id', protect, getDiscussionById);
router.post('/', protect, discussionValidation, validate, createDiscussion);
router.put('/:id', protect, updateDiscussion);
router.delete('/:id', protect, deleteDiscussion);
router.post('/:id/upvote', protect, upvoteDiscussion);

// Comment routes
router.post('/:id/comments', protect, commentValidation, validate, createComment);
router.put('/comments/:commentId', protect, updateComment);
router.delete('/comments/:commentId', protect, deleteComment);
router.post('/comments/:commentId/upvote', protect, upvoteComment);
router.post('/comments/:commentId/best-answer', protect, markBestAnswer);

module.exports = router;
