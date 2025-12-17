const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('video', 'text', 'image'),
    defaultValue: 'video',
    allowNull: false
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: 'Duration in seconds'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  resources: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  tableName: 'lessons',
  timestamps: true,
  indexes: [
    {
      // Course lessons lookup (most common query)
      fields: ['courseId'],
      name: 'lessons_course_id_idx'
    },
    {
      // Composite: courseId + order (for ordered lesson lists)
      fields: ['courseId', 'order'],
      name: 'lessons_course_id_order_idx'
    },
    {
      // Composite: courseId + published (show only published lessons)
      fields: ['courseId', 'published'],
      name: 'lessons_course_id_published_idx'
    },
    {
      // Published status filtering
      fields: ['published'],
      name: 'lessons_published_idx'
    },
    {
      // Lesson type filtering
      fields: ['type'],
      name: 'lessons_type_idx'
    }
  ]
});

module.exports = Lesson;
