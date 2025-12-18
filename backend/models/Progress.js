const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lessonId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  completed: {
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
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'progress',
  timestamps: true
});

module.exports = Progress;