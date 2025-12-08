const { Quiz, QuizSubmission, Course, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
exports.getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { isPublished: true },
      include: [
        {
          model: Course,
          attributes: ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course quizzes
// @route   GET /api/quizzes/course/:courseId
// @access  Private
exports.getCourseQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.findAll({
      where: {
        courseId: req.params.courseId,
        isPublished: true
      },
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [
        {
          model: Course,
          attributes: ['id', 'title']
        }
      ]
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Get user's previous attempts
    const attempts = await QuizSubmission.count({
      where: {
        quizId: req.params.id,
        userId: req.user.id
      }
    });

    res.json({
      success: true,
      data: {
        ...quiz.toJSON(),
        userAttempts: attempts
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private/Teacher/Admin
exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Teacher/Admin
exports.updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await quiz.update(req.body);

    res.json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Teacher/Admin
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await quiz.destroy();

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private
exports.submitQuiz = async (req, res, next) => {
  try {
    const { answers, timeSpent } = req.body;

    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check attempts
    const attemptCount = await QuizSubmission.count({
      where: {
        quizId: req.params.id,
        userId: req.user.id
      }
    });

    if (attemptCount >= quiz.attempts) {
      return res.status(400).json({
        success: false,
        message: 'Maximum attempts exceeded'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[question.id || index];
      const correctAnswer = question.correctAnswer;

      if (userAnswer === correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = score >= quiz.passingScore;

    const submission = await QuizSubmission.create({
      quizId: req.params.id,
      userId: req.user.id,
      answers,
      score,
      isPassed,
      attemptNumber: attemptCount + 1,
      timeSpent
    });

    // Award XP if passed
    if (isPassed) {
      await req.user.increment('xp', { by: 50 });
    }

    res.json({
      success: true,
      message: isPassed ? 'Quiz passed!' : 'Quiz completed',
      data: {
        submission,
        score,
        correctAnswers,
        totalQuestions,
        isPassed
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz results
// @route   GET /api/quizzes/:id/results
// @access  Private
exports.getQuizResults = async (req, res, next) => {
  try {
    const submissions = await QuizSubmission.findAll({
      where: {
        quizId: req.params.id,
        userId: req.user.id
      },
      order: [['submittedAt', 'DESC']]
    });

    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};
