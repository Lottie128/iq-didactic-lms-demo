const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Event title (e.g., "Live Session: Neural Networks")'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Detailed description of the event'
  },
  eventType: {
    type: DataTypes.ENUM('live-class', 'quiz', 'assignment', 'exam', 'office-hours', 'workshop', 'other'),
    allowNull: false,
    defaultValue: 'live-class',
    comment: 'Type of scheduled event'
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Associated course ID'
  },
  instructorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Instructor/teacher user ID (optional for quizzes/assignments)'
  },
  startDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Event start date and time'
  },
  endDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Event end date and time'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Physical location or meeting room'
  },
  meetingLink: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Online meeting link (Zoom, Google Meet, etc.)'
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether this is a recurring event'
  },
  recurrencePattern: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Recurrence pattern (e.g., "weekly", "daily", "monthly")'
  },
  recurrenceEndDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When recurring events should stop'
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum number of attendees (optional)'
  },
  attendeeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Current number of registered attendees'
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether reminder notification has been sent'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
    comment: 'Current status of the event'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional notes or instructions'
  }
}, {
  tableName: 'schedules',
  timestamps: true,
  indexes: [
    {
      fields: ['courseId'],
      name: 'schedules_course_id_idx'
    },
    {
      fields: ['instructorId'],
      name: 'schedules_instructor_id_idx'
    },
    {
      fields: ['eventType'],
      name: 'schedules_event_type_idx'
    },
    {
      fields: ['startDateTime'],
      name: 'schedules_start_datetime_idx'
    },
    {
      fields: ['endDateTime'],
      name: 'schedules_end_datetime_idx'
    },
    {
      fields: ['status'],
      name: 'schedules_status_idx'
    },
    {
      fields: ['courseId', 'startDateTime'],
      name: 'schedules_course_start_idx'
    },
    {
      fields: ['instructorId', 'startDateTime'],
      name: 'schedules_instructor_start_idx'
    }
  ]
});

module.exports = Schedule;