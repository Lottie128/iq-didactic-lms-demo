const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Teacher/instructor user ID'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
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
  videos: {
    type: DataTypes.JSONB,
    defaultValue: []
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
      // Instructor's courses lookup
      fields: ['instructorId'],
      name: 'courses_instructor_id_idx'
    },
    {
      // Category filtering (browse by category)
      fields: ['category'],
      name: 'courses_category_idx'
    },
    {
      // Level filtering
      fields: ['level'],
      name: 'courses_level_idx'
    },
    {
      // Published courses (hide drafts in public listings)
      fields: ['published'],
      name: 'courses_published_idx'
    },
    {
      // Composite: category + published (most common query)
      fields: ['category', 'published'],
      name: 'courses_category_published_idx'
    },
    {
      // Composite: level + published
      fields: ['level', 'published'],
      name: 'courses_level_published_idx'
    },
    {
      // Rating sorting (popular courses)
      fields: ['averageRating'],
      name: 'courses_avg_rating_idx'
    },
    {
      // Enrollment count sorting (trending courses)
      fields: ['enrollmentCount'],
      name: 'courses_enrollment_count_idx'
    },
    {
      // Price range filtering
      fields: ['price'],
      name: 'courses_price_idx'
    },
    {
      // Recently added courses
      fields: ['createdAt'],
      name: 'courses_created_at_idx'
    },
    {
      // Recently updated courses
      fields: ['updatedAt'],
      name: 'courses_updated_at_idx'
    },
    {
      // Text search on title (for PostgreSQL full-text search)
      fields: ['title'],
      name: 'courses_title_idx',
      using: 'btree'
    }
  ]
});

module.exports = Course;
