const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Progress = db.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  lessonId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'lessons',
      key: 'id'
    }
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Time spent in seconds'
  },
  lastPosition: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Video position in seconds'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'progress',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'lessonId']
    }
  ]
});

module.exports = Progress;
