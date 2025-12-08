const { Progress, Lesson, Course, Enrollment } = require('../models');

// @desc    Get lesson progress
// @route   GET /api/progress/lesson/:lessonId
// @access  Private
exports.getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      where: {
        userId: req.user.id,
        lessonId: req.params.lessonId
      },
      include: [
        {
          model: Lesson,
          attributes: ['id', 'title', 'duration']
        }
      ]
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson progress
// @route   PUT /api/progress/lesson/:lessonId
// @access  Private
exports.updateProgress = async (req, res, next) => {
  try {
    const { timeSpent, lastPosition } = req.body;

    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    let progress = await Progress.findOne({
      where: {
        userId: req.user.id,
        lessonId: req.params.lessonId
      }
    });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user.id,
        courseId: lesson.courseId,
        lessonId: req.params.lessonId,
        timeSpent: timeSpent || 0,
        lastPosition: lastPosition || 0
      });
    } else {
      await progress.update({
        timeSpent: (progress.timeSpent || 0) + (timeSpent || 0),
        lastPosition: lastPosition || progress.lastPosition
      });
    }

    res.json({
      success: true,
      message: 'Progress updated',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark lesson as complete
// @route   POST /api/progress/lesson/:lessonId/complete
// @access  Private
exports.markLessonComplete = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    let progress = await Progress.findOne({
      where: {
        userId: req.user.id,
        lessonId: req.params.lessonId
      }
    });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user.id,
        courseId: lesson.courseId,
        lessonId: req.params.lessonId,
        isCompleted: true,
        completedAt: new Date()
      });
    } else {
      await progress.update({
        isCompleted: true,
        completedAt: new Date()
      });
    }

    // Update enrollment progress
    await updateEnrollmentProgress(req.user.id, lesson.courseId);

    // Award XP
    await req.user.increment('xp', { by: 10 });

    res.json({
      success: true,
      message: 'Lesson marked as complete',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course progress
// @route   GET /api/progress/:courseId
// @access  Private
exports.getCourseProgress = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      where: {
        userId: req.user.id,
        courseId: req.params.courseId
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    const progressData = await Progress.findAll({
      where: {
        userId: req.user.id,
        courseId: req.params.courseId
      },
      include: [
        {
          model: Lesson,
          attributes: ['id', 'title', 'duration']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        enrollment,
        lessons: progressData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update enrollment progress
async function updateEnrollmentProgress(userId, courseId) {
  const totalLessons = await Lesson.count({ where: { courseId } });
  const completedLessons = await Progress.count({
    where: {
      userId,
      courseId,
      isCompleted: true
    }
  });

  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const enrollment = await Enrollment.findOne({
    where: { userId, courseId }
  });

  if (enrollment) {
    await enrollment.update({
      progress: progressPercentage,
      isCompleted: progressPercentage === 100,
      completedAt: progressPercentage === 100 ? new Date() : null,
      lastAccessedAt: new Date()
    });
  }
}
