const { Discussion, Comment, Course, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get discussions for a course
// @route   GET /api/discussions/course/:courseId
// @access  Private
exports.getDiscussions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: discussions } = await Discussion.findAndCountAll({
      where: { courseId: req.params.courseId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['isPinned', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: discussions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single discussion
// @route   GET /api/discussions/:id
// @access  Private
exports.getDiscussionById = async (req, res, next) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar']
        }
      ]
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Increment views
    await discussion.increment('views');

    // Get comments
    const comments = await Comment.findAll({
      where: { discussionId: req.params.id, parentId: null },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'avatar']
            }
          ]
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        discussion,
        comments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create discussion
// @route   POST /api/discussions
// @access  Private
exports.createDiscussion = async (req, res, next) => {
  try {
    const { courseId, title, content } = req.body;

    const discussion = await Discussion.create({
      courseId,
      userId: req.user.id,
      title,
      content
    });

    res.status(201).json({
      success: true,
      message: 'Discussion created successfully',
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update discussion
// @route   PUT /api/discussions/:id
// @access  Private
exports.updateDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    if (discussion.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await discussion.update(req.body);

    res.json({
      success: true,
      message: 'Discussion updated successfully',
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete discussion
// @route   DELETE /api/discussions/:id
// @access  Private
exports.deleteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    if (discussion.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await discussion.destroy();

    res.json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote discussion
// @route   POST /api/discussions/:id/upvote
// @access  Private
exports.upvoteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    await discussion.increment('upvotes');

    res.json({
      success: true,
      message: 'Upvoted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create comment
// @route   POST /api/discussions/:id/comments
// @access  Private
exports.createComment = async (req, res, next) => {
  try {
    const { content, parentId } = req.body;

    const comment = await Comment.create({
      discussionId: req.params.id,
      userId: req.user.id,
      content,
      parentId: parentId || null
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/discussions/comments/:commentId
// @access  Private
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await comment.update(req.body);

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/discussions/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await comment.destroy();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote comment
// @route   POST /api/discussions/comments/:commentId/upvote
// @access  Private
exports.upvoteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    await comment.increment('upvotes');

    res.json({
      success: true,
      message: 'Upvoted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark comment as best answer
// @route   POST /api/discussions/comments/:commentId/best-answer
// @access  Private
exports.markBestAnswer = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const discussion = await Discussion.findByPk(comment.discussionId);

    // Only discussion author can mark best answer
    if (discussion.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the discussion author can mark best answer'
      });
    }

    // Unmark previous best answer
    await Comment.update(
      { isBestAnswer: false },
      { where: { discussionId: comment.discussionId } }
    );

    // Mark new best answer
    await comment.update({ isBestAnswer: true });
    await discussion.update({ isSolved: true });

    res.json({
      success: true,
      message: 'Marked as best answer'
    });
  } catch (error) {
    next(error);
  }
};
