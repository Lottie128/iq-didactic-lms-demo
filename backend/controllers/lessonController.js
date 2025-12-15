const { Lesson, Course, Progress } = require('../models');

// @desc    Get all lessons for a course
// @route   GET /api/lessons/course/:courseId
// @access  Public
exports.getAllLessons = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.findAll({
      where: { courseId },
      order: [['order', 'ASC'], ['createdAt', 'ASC']],
      attributes: ['id', 'title', 'description', 'videoUrl', 'duration', 'order', 'published', 'resources']
    });

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lesson by ID
// @route   GET /api/lessons/:id
// @access  Public
exports.getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [
        {
          model: Course,
          attributes: ['id', 'title', 'category']
        }
      ]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // If user is authenticated, get their progress for this lesson
    let progress = null;
    if (req.user) {
      progress = await Progress.findOne({
        where: {
          userId: req.user.id,
          lessonId: lesson.id
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        lesson,
        progress
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lesson
// @route   POST /api/lessons
// @access  Private (Teacher, Admin)
exports.createLesson = async (req, res, next) => {
  try {
    const { courseId, title, description, videoUrl, duration, order, published, resources } = req.body;

    // Check if course exists and user owns it (or is admin)
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course'
      });
    }

    // If order not provided, set it to the next available order
    let lessonOrder = order;
    if (!lessonOrder) {
      const lastLesson = await Lesson.findOne({
        where: { courseId },
        order: [['order', 'DESC']]
      });
      lessonOrder = lastLesson ? lastLesson.order + 1 : 0;
    }

    const lesson = await Lesson.create({
      courseId,
      title,
      description,
      videoUrl,
      duration,
      order: lessonOrder,
      published: published || false,
      resources: resources || []
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Teacher, Admin)
exports.updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [Course]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && lesson.Course.instructorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lesson'
      });
    }

    const { title, description, videoUrl, duration, order, published, resources } = req.body;

    // Update fields
    if (title !== undefined) lesson.title = title;
    if (description !== undefined) lesson.description = description;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (duration !== undefined) lesson.duration = duration;
    if (order !== undefined) lesson.order = order;
    if (published !== undefined) lesson.published = published;
    if (resources !== undefined) lesson.resources = resources;

    await lesson.save();

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Teacher, Admin)
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [Course]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && lesson.Course.instructorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lesson'
      });
    }

    await lesson.destroy();

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder lessons
// @route   POST /api/lessons/reorder
// @access  Private (Teacher, Admin)
exports.reorderLessons = async (req, res, next) => {
  try {
    const { courseId, lessonOrders } = req.body;
    // lessonOrders should be an array of { id, order } objects

    if (!courseId || !Array.isArray(lessonOrders)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request. Provide courseId and lessonOrders array'
      });
    }

    // Check if course exists and user owns it
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reorder lessons for this course'
      });
    }

    // Update all lesson orders
    const updatePromises = lessonOrders.map(({ id, order }) => {
      return Lesson.update(
        { order },
        { where: { id, courseId } }
      );
    });

    await Promise.all(updatePromises);

    // Get updated lessons
    const updatedLessons = await Lesson.findAll({
      where: { courseId },
      order: [['order', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Lessons reordered successfully',
      data: updatedLessons
    });
  } catch (error) {
    next(error);
  }
};
