const { User, Course, Enrollment, Lesson, Progress } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.count();
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalTeachers = await User.count({ where: { role: 'teacher' } });
    const pendingTeachers = await User.count({ where: { role: 'teacher', verified: false } });
    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({ where: { published: true } });
    const totalEnrollments = await Enrollment.count();
    const totalLessons = await Lesson.count();

    // Calculate revenue (sum of all course prices * enrollments)
    const courses = await Course.findAll({ attributes: ['price'] });
    const totalRevenue = courses.reduce((sum, course) => sum + (parseFloat(course.price) || 0), 0) * totalEnrollments;

    // Get recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEnrollments = await Enrollment.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Get average completion rate
    const enrollments = await Enrollment.findAll({ attributes: ['progress'] });
    const avgCompletion = enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
      : 0;

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          teachers: totalTeachers,
          pendingTeachers
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          draft: totalCourses - publishedCourses
        },
        enrollments: {
          total: totalEnrollments,
          recent: recentEnrollments,
          avgCompletion: Math.round(avgCompletion)
        },
        lessons: totalLessons,
        revenue: totalRevenue.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, verified, search, page = 1, limit = 20 } = req.query;
    
    const where = {};
    if (role) where.role = role;
    if (verified !== undefined) where.verified = verified === 'true';
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// @desc    Get pending teacher verifications
// @route   GET /api/admin/teachers/pending
// @access  Private (Admin only)
exports.getPendingTeachers = async (req, res) => {
  try {
    const pendingTeachers = await User.findAll({
      where: {
        role: 'teacher',
        verified: false
      },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: pendingTeachers
    });
  } catch (error) {
    console.error('Get pending teachers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending teachers' });
  }
};

// @desc    Verify/approve teacher
// @route   PUT /api/admin/teachers/:id/verify
// @access  Private (Admin only)
exports.verifyTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    
    const teacher = await User.findOne({
      where: { id, role: 'teacher' }
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    teacher.verified = true;
    await teacher.save();

    res.json({
      success: true,
      message: 'Teacher verified successfully',
      data: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        verified: teacher.verified
      }
    });
  } catch (error) {
    console.error('Verify teacher error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify teacher' });
  }
};

// @desc    Reject teacher verification
// @route   DELETE /api/admin/teachers/:id/reject
// @access  Private (Admin only)
exports.rejectTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    
    const teacher = await User.findOne({
      where: { id, role: 'teacher', verified: false }
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Pending teacher not found' });
    }

    // Change to student or delete based on requirement
    teacher.role = 'student';
    await teacher.save();

    res.json({
      success: true,
      message: 'Teacher application rejected'
    });
  } catch (error) {
    console.error('Reject teacher error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject teacher' });
  }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, verified } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (verified !== undefined) user.verified = verified;

    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userData
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

// @desc    Get all courses with instructor info
// @route   GET /api/admin/courses
// @access  Private (Admin only)
exports.getAllCourses = async (req, res) => {
  try {
    const { published, search, page = 1, limit = 20 } = req.query;
    
    const where = {};
    if (published !== undefined) where.published = published === 'true';
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
};