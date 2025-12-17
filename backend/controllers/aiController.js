const { generateQuizQuestions, generateLessonContent, chatWithAI, generateCourseOutline } = require('../utils/gemini');
const { Course, Lesson } = require('../models');

// @desc    Generate quiz questions using AI
// @route   POST /api/ai/generate-quiz
// @access  Private (Teacher, Admin)
exports.generateQuiz = async (req, res, next) => {
  try {
    const { courseId, lessonId, questionCount } = req.body;

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

    let lessonContent = '';

    // If lessonId provided, get lesson content for context
    if (lessonId) {
      const lesson = await Lesson.findByPk(parseInt(lessonId));
      if (lesson) {
        lessonContent = `${lesson.title}\n\n${lesson.description || ''}\n\n${lesson.content || ''}`;
      }
    }

    // Generate quiz questions using Gemini AI
    const questions = await generateQuizQuestions(
      course.title,
      course.description,
      lessonContent,
      questionCount || 5
    );

    res.status(200).json({
      success: true,
      message: 'Quiz questions generated successfully',
      data: questions
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
exports.generateContent = async (req, res, next) => {
  try {
    const { lessonTitle, courseId } = req.body;

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

    const courseContext = `Course: ${course.title}\n${course.description}`;

    // Generate lesson content
    const content = await generateLessonContent(lessonTitle, courseContext);

    res.status(200).json({
      success: true,
      message: 'Lesson content generated successfully',
      data: {
        content
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
exports.generateOutline = async (req, res, next) => {
  try {
    const { courseTitle, courseDescription, lessonCount } = req.body;

    if (!courseTitle || !courseDescription) {
      return res.status(400).json({
        success: false,
        message: 'Course title and description are required'
      });
    }

    // Generate course outline
    const outline = await generateCourseOutline(
      courseTitle,
      courseDescription,
      lessonCount || 10
    );

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
exports.chat = async (req, res, next) => {
  try {
    const { question, courseId, lessonId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    let context = '';

    // Build context from course and lesson if provided
    if (courseId) {
      const course = await Course.findByPk(parseInt(courseId));
      if (course) {
        context += `Course: ${course.title}\n${course.description}\n\n`;
      }
    }

    if (lessonId) {
      const lesson = await Lesson.findByPk(parseInt(lessonId));
      if (lesson) {
        context += `Lesson: ${lesson.title}\n${lesson.description || ''}\n${lesson.content || ''}`;
      }
    }

    // Get AI response
    const response = await chatWithAI(question, context);

    res.status(200).json({
      success: true,
      data: {
        question,
        response
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
