const { Notification, User, Course } = require('../models');
const { Op } = require('sequelize');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };
    if (unreadOnly === 'true') {
      whereClause.read = false;
    }

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // Get unread count
    const unreadCount = await Notification.count({
      where: {
        userId: req.user.id,
        read: false
      }
    });

    res.json({
      success: true,
      count,
      unreadCount,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    next(error);
  }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.count({
      where: {
        userId: req.user.id,
        read: false
      }
    });

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.update({ read: true });

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { read: true },
      {
        where: {
          userId: req.user.id,
          read: false
        }
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    next(error);
  }
};

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/clear-read
// @access  Private
exports.clearReadNotifications = async (req, res, next) => {
  try {
    await Notification.destroy({
      where: {
        userId: req.user.id,
        read: true
      }
    });

    res.json({
      success: true,
      message: 'Read notifications cleared'
    });
  } catch (error) {
    console.error('Error clearing read notifications:', error);
    next(error);
  }
};

// Helper function to create notification
exports.createNotification = async (userId, type, title, message, link = null, metadata = null) => {
  try {
    await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      metadata
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};