const { DataTypes } = require('sequelize');
const db = require('../config/db');

const QuizSubmission = db.define('QuizSubmission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quizId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'quizzes',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  answers: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  isPassed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  attemptNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  timeSpent: {
    type: DataTypes.INTEGER,
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
