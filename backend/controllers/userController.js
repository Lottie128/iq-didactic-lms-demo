const { User, Course, Enrollment } = require('../models');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Course,
          as: 'courses',
          attributes: ['id', 'title', 'thumbnail', 'enrollmentCount']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      country,
      city,
      birthday,
      occupation,
      educationLevel,
      bio,
      avatar,
      timezone,
      language
    } = req.body;

    const user = await User.findByPk(req.user.id);

    await user.update({
      name: name || user.name,
      phone: phone || user.phone,
      country: country || user.country,
      city: city || user.city,
      birthday: birthday || user.birthday,
      occupation: occupation || user.occupation,
      educationLevel: educationLevel || user.educationLevel,
      bio: bio || user.bio,
      avatar: avatar || user.avatar,
      timezone: timezone || user.timezone,
      language: language || user.language
    });

    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.count({
      where: { userId: req.user.id }
    });

    const completedCourses = await Enrollment.count({
      where: {
        userId: req.user.id,
        isCompleted: true
      }
    });

    res.json({
      success: true,
      data: {
        enrolledCourses: enrollments,
        completedCourses,
        xp: req.user.xp,
        level: req.user.level,
        streak: req.user.streak
      }
    });
  } catch (error) {
    next(error);
  }
};
