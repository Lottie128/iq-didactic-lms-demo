const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const QuizSubmission = sequelize.define('QuizSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quizzes',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  answers: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  passed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Time spent in seconds'
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'quiz_submissions',
  timestamps: true
});

module.exports = QuizSubmission;