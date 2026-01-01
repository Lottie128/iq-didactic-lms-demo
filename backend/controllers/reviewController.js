const { Review, Course, User } = require('../models');
const db = require('../config/db');

// @desc    Get course reviews
// @route   GET /api/reviews/course/:courseId
// @access  Public
exports.getCourseReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { courseId: req.params.courseId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatar']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    next(error);
  }
};

// @desc    Create review
// @route   POST /api/reviews/course/:courseId
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    // Check if already reviewed
    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        courseId: req.params.courseId
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }

    const review = await Review.create({
      userId: req.user.id,
      courseId: req.params.courseId,
      rating,
      comment
    });

    // Fetch the review with user data
    const reviewWithUser = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatar']
        }
      ]
    });

    // Update course average rating
    await updateCourseRating(req.params.courseId);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: reviewWithUser
    });
  } catch (error) {
    console.error('Error creating review:', error);
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    await review.update({
      ...req.body,
      edited: true
    });

    // Fetch updated review with user data
    const updatedReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatar']
        }
      ]
    });

    // Update course average rating
    await updateCourseRating(review.courseId);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const courseId = review.courseId;
    await review.destroy();

    // Update course average rating
    await updateCourseRating(courseId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    next(error);
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = async (req, res, next) => {
  try {
    const { helpful } = req.body;
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (helpful) {
      await review.increment('helpful');
    } else {
      await review.increment('notHelpful');
    }

    res.json({
      success: true,
      message: 'Feedback recorded'
    });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    next(error);
  }
};

// Helper function to update course rating
async function updateCourseRating(courseId) {
  try {
    const reviews = await Review.findAll({
      where: { courseId },
      attributes: ['rating']
    });

    if (reviews.length === 0) {
      const course = await Course.findByPk(courseId);
      if (course) {
        await course.update({
          averageRating: 0,
          reviewCount: 0
        });
      }
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    const course = await Course.findByPk(courseId);
    if (course) {
      await course.update({
        averageRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length
      });
    }
  } catch (error) {
    console.error('Error updating course rating:', error);
  }
}