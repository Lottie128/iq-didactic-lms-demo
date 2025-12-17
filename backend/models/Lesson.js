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
    allowNull: true,
    comment: 'Short description shown in playlist'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Full content/article displayed below video player - supports Markdown'
  },
  type: {
    type: DataTypes.ENUM('video', 'text', 'image'),
    defaultValue: 'video',
    allowNull: false
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Supports YouTube, Vimeo, S3, any streaming platform URL'
  },
  videoPlatform: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Auto-detected: youtube, vimeo, s3, custom, etc.'
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: 'Duration in minutes',
    defaultValue: 0
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  thumbnail: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Lesson thumbnail - can be base64 or URL'
  },
  resources: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Additional downloadable resources for this lesson'
  }
}, {
  tableName: 'lessons',
  timestamps: true,
  indexes: [
    {
      fields: ['courseId'],
      name: 'lessons_course_id_idx'
    },
    {
      fields: ['courseId', 'order'],
      name: 'lessons_course_id_order_idx'
    },
    {
      fields: ['courseId', 'published'],
      name: 'lessons_course_id_published_idx'
    },
    {
      fields: ['published'],
      name: 'lessons_published_idx'
    },
    {
      fields: ['type'],
      name: 'lessons_type_idx'
    }
  ]
});

module.exports = Lesson;
