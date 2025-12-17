const { Lesson, Course, Progress } = require('../models');
const { detectVideoPlatform, isValidVideoUrl } = require('../utils/videoHelper');

// @desc    Get all lessons for a course
// @route   GET /api/lessons/course/:courseId
// @access  Public
exports.getAllLessons = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.findAll({
      where: { courseId: String(courseId) },
      order: [['order', 'ASC'], ['createdAt', 'ASC']],
      attributes: ['id', 'title', 'description', 'content', 'type', 'videoUrl', 'videoPlatform', 'duration', 'order', 'published', 'thumbnail', 'resources']
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
    const { courseId, title, description, content, type, videoUrl, duration, order, published, thumbnail, resources } = req.body;

    // Convert courseId to string if it's a number
    const courseIdStr = String(courseId);

    // Check if course exists and user owns it (or is admin)
    const course = await Course.findByPk(courseIdStr);
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

    // Detect video platform if videoUrl is provided
    let videoPlatform = null;
    let embedUrl = videoUrl;
    
    if (type === 'video' && videoUrl) {
      if (!isValidVideoUrl(videoUrl)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid video URL format'
        });
      }

      const detection = detectVideoPlatform(videoUrl);
      videoPlatform = detection.platform;
      embedUrl = detection.embedUrl || videoUrl;
    }

    // If order not provided, set it to the next available order
    let lessonOrder = order;
    if (!lessonOrder && lessonOrder !== 0) {
      const lastLesson = await Lesson.findOne({
        where: { courseId: courseIdStr },
        order: [['order', 'DESC']]
      });
      lessonOrder = lastLesson ? lastLesson.order + 1 : 0;
    }

    const lesson = await Lesson.create({
      courseId: courseIdStr,
      title,
      description: description || '',
      content: content || '',
      type: type || 'video',
      videoUrl: embedUrl,
      videoPlatform,
      duration: parseInt(duration) || 0,
      order: lessonOrder,
      published: published !== undefined ? published : true,
      thumbnail: thumbnail || null,
      resources: resources || []
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
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

    const { title, description, content, type, videoUrl, duration, order, published, thumbnail, resources } = req.body;

    // Update fields
    if (title !== undefined) lesson.title = title;
    if (description !== undefined) lesson.description = description;
    if (content !== undefined) lesson.content = content;
    if (type !== undefined) lesson.type = type;
    if (duration !== undefined) lesson.duration = parseInt(duration) || 0;
    if (order !== undefined) lesson.order = order;
    if (published !== undefined) lesson.published = published;
    if (thumbnail !== undefined) lesson.thumbnail = thumbnail;
    if (resources !== undefined) lesson.resources = resources;

    // Handle video URL update with platform detection
    if (videoUrl !== undefined) {
      if (type === 'video' && videoUrl) {
        if (!isValidVideoUrl(videoUrl)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid video URL format'
          });
        }

        const detection = detectVideoPlatform(videoUrl);
        lesson.videoPlatform = detection.platform;
        lesson.videoUrl = detection.embedUrl || videoUrl;
      } else {
        lesson.videoUrl = videoUrl;
      }
    }

    await lesson.save();

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
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

    const courseIdStr = String(courseId);

    // Check if course exists and user owns it
    const course = await Course.findByPk(courseIdStr);
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
        { where: { id, courseId: courseIdStr } }
      );
    });

    await Promise.all(updatePromises);

    // Get updated lessons
    const updatedLessons = await Lesson.findAll({
      where: { courseId: courseIdStr },
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
