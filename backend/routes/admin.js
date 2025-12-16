const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

// All admin routes require admin role
router.use(protect);
router.use(authorize('admin'));

// @route   POST /api/admin/users
// @desc    Create a new user (admin only)
// @access  Private/Admin
router.post('/users', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      phone,
      country,
      city,
      birthday,
      occupation,
      educationLevel
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      country,
      city,
      birthday,
      occupation,
      educationLevel
    });

    // Return user without token (admin stays logged in)
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        country: user.country,
        city: user.city
      }
    });
  } catch (error) {
    console.error('Admin create user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create user'
    });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalUsers: 1250,
      totalCourses: 45,
      totalEnrollments: 3420,
      totalRevenue: 125430,
      activeUsers: 892,
      newUsersThisMonth: 156,
      completionRate: 67.5,
      averageRating: 4.6
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/analytics/users
// @desc    Get user analytics
// @access  Private/Admin
router.get('/analytics/users', async (req, res) => {
  try {
    const analytics = {
      userGrowth: [
        { month: 'Jan', users: 850 },
        { month: 'Feb', users: 920 },
        { month: 'Mar', users: 1050 },
        { month: 'Apr', users: 1150 },
        { month: 'May', users: 1250 }
      ],
      usersByRole: {
        students: 1100,
        teachers: 145,
        admins: 5
      },
      activeVsInactive: {
        active: 892,
        inactive: 358
      }
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/analytics/courses
// @desc    Get course analytics
// @access  Private/Admin
router.get('/analytics/courses', async (req, res) => {
  try {
    const analytics = {
      popularCourses: [
        { id: 1, title: 'Introduction to React', enrollments: 450, rating: 4.8 },
        { id: 2, title: 'Python for Beginners', enrollments: 380, rating: 4.6 },
        { id: 3, title: 'Web Design Masterclass', enrollments: 320, rating: 4.7 }
      ],
      coursesByCategory: {
        Programming: 15,
        Design: 12,
        Business: 10,
        Marketing: 8
      },
      completionRates: {
        high: 25,
        medium: 15,
        low: 5
      }
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/analytics/revenue
// @desc    Get revenue analytics
// @access  Private/Admin
router.get('/analytics/revenue', async (req, res) => {
  try {
    const analytics = {
      monthlyRevenue: [
        { month: 'Jan', revenue: 18500 },
        { month: 'Feb', revenue: 21200 },
        { month: 'Mar', revenue: 24800 },
        { month: 'Apr', revenue: 28900 },
        { month: 'May', revenue: 32030 }
      ],
      totalRevenue: 125430,
      averageOrderValue: 36.68,
      projectedRevenue: 450000
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
