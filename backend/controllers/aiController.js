const aiService = require('../services/aiService');
const { Course, Lesson, User, Enrollment } = require('../models');

// @desc    Generate quiz questions using AI
// @route   POST /api/ai/generate-quiz
// @access  Private (Teacher, Admin)
exports.generateQuiz = async (req, res) => {
  try {
    const { courseId, lessonId, questionCount = 5 } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Get course information
    const course = await Course.findByPk(parseInt(courseId));
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
        message: 'Not authorized to generate quiz for this course'
      });
    }

    let lessonContent = course.description;

    // If lessonId provided, get lesson content for context
    if (lessonId) {
      const lesson = await Lesson.findByPk(parseInt(lessonId));
      if (lesson) {
        lessonContent = `${lesson.title}\n\n${lesson.description || ''}\n\n${lesson.content || ''}`;
      }
    }

    // Generate quiz questions using Gemini AI
    const result = await aiService.generateQuizQuestions(
      course.title,
      lessonContent,
      course.level
    );

    res.status(200).json({
      success: true,
      message: 'Quiz questions generated successfully',
      data: result.questions || []
    });
  } catch (error) {
    console.error('AI Generate Quiz Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate quiz questions'
    });
  }
};

// @desc    Generate lesson content using AI
// @route   POST /api/ai/generate-content
// @access  Private (Teacher, Admin)
exports.generateContent = async (req, res) => {
  try {
    const { lessonTitle, courseId, duration = 30 } = req.body;

    if (!lessonTitle || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Lesson title and course ID are required'
      });
    }

    // Get course for context
    const course = await Course.findByPk(parseInt(courseId));
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Generate lesson content
    const content = await aiService.chatWithTutor(
      `Create detailed lesson content for: ${lessonTitle}. Course: ${course.title}, Level: ${course.level}. Include introduction, main concepts, examples, and summary.`,
      {
        courseName: course.title,
        studentLevel: course.level,
        topic: lessonTitle
      }
    );

    res.status(200).json({
      success: true,
      message: 'Lesson content generated successfully',
      data: {
        content: content.response,
        suggestedDuration: duration
      }
    });
  } catch (error) {
    console.error('AI Generate Content Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate content'
    });
  }
};

// @desc    Generate course outline/curriculum
// @route   POST /api/ai/generate-outline
// @access  Private (Teacher, Admin)
exports.generateOutline = async (req, res) => {
  try {
    const { topic, level = 'intermediate', duration = 8 } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Course topic is required'
      });
    }

    // Generate course outline
    const outline = await aiService.generateCourseOutline(topic, level, duration);

    res.status(200).json({
      success: true,
      message: 'Course outline generated successfully',
      data: outline
    });
  } catch (error) {
    console.error('AI Generate Outline Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate course outline'
    });
  }
};

// @desc    Chat with AI Teacher
// @route   POST /api/ai/chat
// @access  Private (Student, Teacher, Admin)
exports.chat = async (req, res) => {
  try {
    const { question, courseId, lessonId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    let context = {
      studentLevel: req.user.level || 1,
      courseName: 'General',
      topic: 'General Education'
    };

    // Build context from course and lesson if provided
    if (courseId) {
      const course = await Course.findByPk(parseInt(courseId));
      if (course) {
        context.courseName = course.title;
        context.topic = course.category;
      }
    }

    if (lessonId) {
      const lesson = await Lesson.findByPk(parseInt(lessonId));
      if (lesson) {
        context.topic = lesson.title;
      }
    }

    // Get AI response
    const response = await aiService.chatWithTutor(question, context);

    res.status(200).json({
      success: true,
      data: {
        question,
        answer: response.response,
        timestamp: response.timestamp
      }
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'AI chat failed'
    });
  }
};

// @desc    Get personalized course recommendations
// @route   GET /api/ai/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    // Get user's enrolled courses
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      include: [{ model: Course, as: 'Course' }]
    });

    const enrolledCourses = enrollments.map(e => ({
      title: e.Course.title,
      category: e.Course.category,
      level: e.Course.level
    }));

    // Generate recommendations
    const recommendations = await aiService.generateCourseRecommendations(
      {
        level: user.level,
        xp: user.xp,
        role: user.role,
        educationLevel: user.educationLevel,
        occupation: user.occupation
      },
      enrolledCourses
    );

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('AI Recommendations Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate recommendations'
    });
  }
};

// @desc    Generate personalized study tips
// @route   GET /api/ai/study-tips
// @access  Private
exports.getStudyTips = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    // Calculate user performance (simplified)
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id }
    });

    const avgProgress = enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
      : 0;

    const userPerformance = {
      averageScore: Math.round(avgProgress),
      streak: user.streak || 0
    };

    // Identify weak areas (simplified - could be more sophisticated)
    const weakAreas = ['Time Management', 'Consistency', 'Practice'];

    const tips = await aiService.generateStudyTips(userPerformance, weakAreas);

    res.status(200).json({
      success: true,
      data: tips
    });
  } catch (error) {
    console.error('AI Study Tips Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate study tips'
    });
  }
};