const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const QuizSubmission = sequelize.define('QuizSubmission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  quizId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  answers: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  passed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    comment: 'Time spent in seconds'
  },
  aiProctoring: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'AI proctoring data from frontend'
  },
  attempt: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'quiz_submissions',
  timestamps: true
});

module.exports = QuizSubmission;
