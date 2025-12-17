const { User, Course, Enrollment, Lesson, Progress } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// @desc    Get student dashboard analytics
// @route   GET /api/analytics/student
// @access  Private (Student)
exports.getStudentAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get enrollments with course details
    const enrollments = await Enrollment.findAll({
      where: { userId },
      include: [{
        model: Course,
        as: 'Course',
        include: [{
          model: User,
          as: 'instructor',
          attributes: ['name']
        }]
      }]
    });

    // Calculate stats
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.progress >= 100).length;
    const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
    const avgProgress = totalCourses > 0
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses
      : 0;

    // Get total lessons watched
    const completedLessons = await Progress.count({
      where: {
        userId,
        completed: true
      }
    });

    // Get learning streak
    const recentProgress = await Progress.findAll({
      where: { userId },
      attributes: ['createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 30
    });

    // Calculate streak (consecutive days)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < recentProgress.length; i++) {
      const progressDate = new Date(recentProgress[i].createdAt);
      progressDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - progressDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }

    // Get time spent (sum of timeSpent)
    const timeSpentResult = await Progress.sum('timeSpent', {
      where: { userId }
    });
    const totalHours = Math.floor((timeSpentResult || 0) / 60);

    res.json({
      success: true,
      data: {
        overview: {
          totalCourses,
          completedCourses,
          inProgressCourses,
          avgProgress: Math.round(avgProgress),
          completedLessons,
          streak,
          totalHours
        },
        recentCourses: enrollments.slice(0, 5).map(e => ({
          id: e.Course.id,
          title: e.Course.title,
          instructor: e.Course.instructor.name,
          progress: e.progress,
          thumbnail: e.Course.thumbnail,
          lastAccessed: e.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error('Student analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

// @desc    Get teacher dashboard analytics
// @route   GET /api/analytics/teacher
// @access  Private (Teacher)
exports.getTeacherAnalytics = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Get teacher's courses
    const courses = await Course.findAll({
      where: { instructorId: teacherId },
      include: [{
        model: Lesson,
        as: 'lessons'
      }]
    });

    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.published).length;
    const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);

    // Get enrollments for teacher's courses
    const courseIds = courses.map(c => c.id);
    const enrollments = await Enrollment.findAll({
      where: {
        courseId: { [Op.in]: courseIds }
      },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'avatar']
      }]
    });

    const totalStudents = enrollments.length;
    const uniqueStudents = [...new Set(enrollments.map(e => e.userId))].length;

    // Calculate average completion
    const avgCompletion = enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
      : 0;

    // Get revenue
    const revenue = courses.reduce((sum, course) => {
      const courseEnrollments = enrollments.filter(e => e.courseId === course.id).length;
      return sum + (parseFloat(course.price) * courseEnrollments);
    }, 0);

    // Get course performance
    const coursePerformance = courses.map(course => {
      const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
      const avgProgress = courseEnrollments.length > 0
        ? courseEnrollments.reduce((sum, e) => sum + e.progress, 0) / courseEnrollments.length
        : 0;

      return {
        id: course.id,
        title: course.title,
        students: courseEnrollments.length,
        avgProgress: Math.round(avgProgress),
        published: course.published,
        lessons: course.lessons.length
      };
    });

    // Get recent students
    const recentStudents = enrollments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(e => ({
        id: e.User.id,
        name: e.User.name,
        email: e.User.email,
        avatar: e.User.avatar,
        enrolledAt: e.createdAt,
        courseId: e.courseId,
        progress: e.progress
      }));

    res.json({
      success: true,
      data: {
        overview: {
          totalCourses,
          publishedCourses,
          totalLessons,
          totalStudents: uniqueStudents,
          totalEnrollments: totalStudents,
          avgCompletion: Math.round(avgCompletion),
          revenue: revenue.toFixed(2)
        },
        coursePerformance,
        recentStudents
      }
    });
  } catch (error) {
    console.error('Teacher analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

// @desc    Get teacher's students
// @route   GET /api/analytics/teacher/students
// @access  Private (Teacher)
exports.getTeacherStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { courseId, search, page = 1, limit = 20 } = req.query;

    // Get teacher's course IDs
    const courses = await Course.findAll({
      where: { instructorId: teacherId },
      attributes: ['id', 'title']
    });

    const courseIds = courses.map(c => c.id);

    if (courseIds.length === 0) {
      return res.json({
        success: true,
        data: {
          students: [],
          pagination: { total: 0, page: 1, pages: 0 }
        }
      });
    }

    // Build where clause
    const where = {
      courseId: { [Op.in]: courseIds }
    };

    if (courseId) {
      where.courseId = parseInt(courseId);
    }

    // Get enrollments
    const offset = (page - 1) * limit;
    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'avatar'],
          where: search ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              { email: { [Op.iLike]: `%${search}%` } }
            ]
          } : undefined
        },
        {
          model: Course,
          as: 'Course',
          attributes: ['id', 'title']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    const students = enrollments.map(e => ({
      userId: e.User.id,
      name: e.User.name,
      email: e.User.email,
      avatar: e.User.avatar,
      courseId: e.Course.id,
      courseTitle: e.Course.title,
      progress: e.progress,
      enrolledAt: e.createdAt,
      lastActive: e.updatedAt
    }));

    res.json({
      success: true,
      data: {
        students,
        courses: courses.map(c => ({ id: c.id, title: c.title })),
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get teacher students error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};