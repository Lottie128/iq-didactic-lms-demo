const { Schedule, Course, User, Enrollment } = require('../models');
const { Op } = require('sequelize');

// Get all schedules for logged-in user (based on enrolled courses)
exports.getUserSchedules = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let schedules;

    if (userRole === 'admin') {
      // Admins can see all schedules
      schedules = await Schedule.findAll({
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'category']
          },
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['startDateTime', 'ASC']]
      });
    } else if (userRole === 'teacher') {
      // Teachers see schedules for their courses
      schedules = await Schedule.findAll({
        where: {
          instructorId: userId
        },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'category']
          },
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['startDateTime', 'ASC']]
      });
    } else {
      // Students see schedules for enrolled courses
      const enrollments = await Enrollment.findAll({
        where: { userId },
        attributes: ['courseId']
      });

      const courseIds = enrollments.map(e => e.courseId);

      schedules = await Schedule.findAll({
        where: {
          courseId: { [Op.in]: courseIds }
        },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'category']
          },
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['startDateTime', 'ASC']]
      });
    }

    res.json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Get user schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedules',
      error: error.message
    });
  }
};

// Get schedules by month
exports.getSchedulesByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Create date range for the month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    let whereClause = {
      startDateTime: {
        [Op.between]: [startOfMonth, endOfMonth]
      }
    };

    // Apply role-based filtering
    if (userRole === 'teacher') {
      whereClause.instructorId = userId;
    } else if (userRole === 'student') {
      const enrollments = await Enrollment.findAll({
        where: { userId },
        attributes: ['courseId']
      });
      const courseIds = enrollments.map(e => e.courseId);
      whereClause.courseId = { [Op.in]: courseIds };
    }
    // Admin has no additional filters

    const schedules = await Schedule.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'category']
        },
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['startDateTime', 'ASC']]
    });

    res.json({
      success: true,
      month: `${year}-${String(month).padStart(2, '0')}`,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Get schedules by month error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedules for month',
      error: error.message
    });
  }
};

// Get schedules for a specific course
exports.getCourseSchedules = async (req, res) => {
  try {
    const { courseId } = req.params;

    const schedules = await Schedule.findAll({
      where: { courseId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'category']
        },
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['startDateTime', 'ASC']]
    });

    res.json({
      success: true,
      courseId: parseInt(courseId),
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Get course schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course schedules',
      error: error.message
    });
  }
};

// Get upcoming schedules (next 7 days)
exports.getUpcomingSchedules = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const limit = parseInt(req.query.limit) || 10;

    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    let whereClause = {
      startDateTime: {
        [Op.between]: [now, sevenDaysLater]
      },
      status: { [Op.in]: ['scheduled', 'in-progress'] }
    };

    // Apply role-based filtering
    if (userRole === 'teacher') {
      whereClause.instructorId = userId;
    } else if (userRole === 'student') {
      const enrollments = await Enrollment.findAll({
        where: { userId },
        attributes: ['courseId']
      });
      const courseIds = enrollments.map(e => e.courseId);
      whereClause.courseId = { [Op.in]: courseIds };
    }

    const schedules = await Schedule.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'category']
        },
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['startDateTime', 'ASC']],
      limit
    });

    res.json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Get upcoming schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming schedules',
      error: error.message
    });
  }
};

// Get single schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'category', 'description']
        },
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Get schedule by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedule',
      error: error.message
    });
  }
};

// Create new schedule (teachers and admins only)
exports.createSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Only teachers and admins can create schedules
    if (userRole !== 'teacher' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only teachers and admins can create schedules'
      });
    }

    const {
      title,
      description,
      eventType,
      courseId,
      instructorId,
      startDateTime,
      endDateTime,
      location,
      meetingLink,
      isRecurring,
      recurrencePattern,
      recurrenceEndDate,
      capacity,
      notes
    } = req.body;

    // Validate required fields
    if (!title || !eventType || !courseId || !startDateTime || !endDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, eventType, courseId, startDateTime, endDateTime'
      });
    }

    // Validate course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // For teachers, ensure they own the course
    if (userRole === 'teacher' && course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only create schedules for your own courses'
      });
    }

    // Validate dates
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date/time must be after start date/time'
      });
    }

    // Create schedule
    const schedule = await Schedule.create({
      title,
      description,
      eventType,
      courseId,
      instructorId: instructorId || userId,
      startDateTime,
      endDateTime,
      location,
      meetingLink,
      isRecurring: isRecurring || false,
      recurrencePattern,
      recurrenceEndDate,
      capacity,
      notes,
      status: 'scheduled'
    });

    // Fetch the created schedule with associations
    const createdSchedule = await Schedule.findByPk(schedule.id, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'category']
        },
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: createdSchedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create schedule',
      error: error.message
    });
  }
};

// Update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const schedule = await Schedule.findByPk(id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Authorization check
    if (userRole === 'teacher' && schedule.course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update schedules for your own courses'
      });
    }

    if (userRole === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Students cannot update schedules'
      });
    }

    // Validate dates if provided
    if (req.body.startDateTime && req.body.endDateTime) {
      const start = new Date(req.body.startDateTime);
      const end = new Date(req.body.endDateTime);
      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: 'End date/time must be after start date/time'
        });
      }
    }

    // Update schedule
    await schedule.update(req.body);

    // Fetch updated schedule with associations
    const updatedSchedule = await Schedule.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'category']
        },
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: updatedSchedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update schedule',
      error: error.message
    });
  }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const schedule = await Schedule.findByPk(id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Authorization check
    if (userRole === 'teacher' && schedule.course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete schedules for your own courses'
      });
    }

    if (userRole === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Students cannot delete schedules'
      });
    }

    await schedule.destroy();

    res.json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete schedule',
      error: error.message
    });
  }
};

// Get schedules by date range
exports.getSchedulesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    let whereClause = {
      startDateTime: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    };

    // Apply role-based filtering
    if (userRole === 'teacher') {
      whereClause.instructorId = userId;
    } else if (userRole === 'student') {
      const enrollments = await Enrollment.findAll({
        where: { userId },
        attributes: ['courseId']
      });
      const courseIds = enrollments.map(e => e.courseId);
      whereClause.courseId = { [Op.in]: courseIds };
    }

    const schedules = await Schedule.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'category']
        },
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['startDateTime', 'ASC']]
    });

    res.json({
      success: true,
      dateRange: { startDate, endDate },
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Get schedules by date range error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedules',
      error: error.message
    });
  }
};