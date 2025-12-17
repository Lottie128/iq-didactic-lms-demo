const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  instructorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Teacher/instructor user ID'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thumbnail: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Course thumbnail - supports URL or base64 encoded image'
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  enrollmentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  whatYouLearn: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'courses',
  timestamps: true,
  indexes: [
    {
      fields: ['instructorId'],
      name: 'courses_instructor_id_idx'
    },
    {
      fields: ['category'],
      name: 'courses_category_idx'
    },
    {
      fields: ['level'],
      name: 'courses_level_idx'
    },
    {
      fields: ['published'],
      name: 'courses_published_idx'
    },
    {
      fields: ['category', 'published'],
      name: 'courses_category_published_idx'
    },
    {
      fields: ['level', 'published'],
      name: 'courses_level_published_idx'
    },
    {
      fields: ['averageRating'],
      name: 'courses_avg_rating_idx'
    },
    {
      fields: ['enrollmentCount'],
      name: 'courses_enrollment_count_idx'
    },
    {
      fields: ['price'],
      name: 'courses_price_idx'
    },
    {
      fields: ['createdAt'],
      name: 'courses_created_at_idx'
    },
    {
      fields: ['updatedAt'],
      name: 'courses_updated_at_idx'
    },
    {
      fields: ['title'],
      name: 'courses_title_idx',
      using: 'btree'
    }
  ]
});

module.exports = Course;
